import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faStar as faStarOutline,
} from '@fortawesome/free-solid-svg-icons'
import './ViewBook.css'

const ViewBook = () => {
  const { book_id } = useParams()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isLoggedIn = !!localStorage.getItem('token')
  const isadmin =
    !!localStorage.getItem('username') &&
    localStorage.getItem('username') === 'admin'
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const token = localStorage.getItem('token')

        const bookResponse = await fetch(
          `http://localhost:8800/api/v1/books/${book_id}`
        )
        const bookData = await bookResponse.json()
        setBook(bookData)

        // Fetch reviews
        if (isLoggedIn) {
          const reviewsResponse = await fetch(
            `http://localhost:8800/api/v1/reviews/by-book/${book_id}`,
            {
              headers: { auth: `Bearer ${token}` },
            }
          )
          const reviewsData = await reviewsResponse.json()
          setReviews(reviewsData)

          // Fetch current user's review
          const userReviewResponse = await fetch(
            `http://localhost:8800/api/v1/reviews/by-book/${book_id}/user`,
            {
              headers: { auth: `Bearer ${token}` },
            }
          )
          const userReviewData = await userReviewResponse.json()
          setUserReview(userReviewData.review || null)
        }
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [book_id, isLoggedIn])

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:8800/api/v1/reviews/by-book/${book_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            auth: `Bearer ${token}`,
          },
          body: JSON.stringify({ review: reviewText, rating: reviewRating }),
        }
      )
      const newReview = await response.json()

      setReviews([...reviews, newReview])
      setUserReview(newReview)
      setReviewText('')
      setReviewRating(0)
    } catch (err) {
      alert('Failed to submit review')
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={i < rating ? faStar : faStarOutline}
        style={{ color: i < rating ? '#FFD700' : '#ccc', margin: '0 2px' }}
      />
    ))
  }

  const handleRemoveBook = async (bookId) => {
    const token = localStorage.getItem('token')
    try {
      let response = await fetch(
        `http://localhost:8800/api/v1/books/${bookId}`,
        {
          method: 'DELETE',
          headers: {
            auth: `Bearer ${token}`,
            'Content-Type': 'application-json',
          },
        }
      )
      response = await response.json()
      navigate('/')
      alert('Book was deleted succesfully')
    } catch (error) {
      alert('Error Deleting current book')
    }
  }

  if (loading) return <div>Loading book details...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='book-details-wrapper'>
      <div className='book-details'>
        <div className='book-details-image'>
          <img src={book.url} alt={book.title} />
        </div>
        <div className='book-info'>
          <h1>{book.title}</h1>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Genre:</strong> {book.genre}
          </p>
          <p>
            <strong>Price:</strong> ${book.price}
          </p>
          <p>
            <strong>Stock:</strong> {book.stock_quantity} copies available
          </p>
          <p>
            <strong>Description:</strong>
            {book.description}
          </p>
          {isLoggedIn && isadmin && (
            <div
              style={{
                display: 'flex',
                gap: '20px',

                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
            >
              <button
                className='remove-book'
                onClick={() => handleRemoveBook(book.book_id)}
              >
                Remove
              </button>
              <button className='add-book'>Add New</button>
            </div>
          )}
        </div>
      </div>

      {isLoggedIn ? (
        <div className='reviews-container'>
          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to write one!</p>
          ) : (
            <ul className='reviews-list'>
              {reviews.map((review) => (
                <li key={review.id}>
                  <strong>{review.user_name}:</strong> {review.text}
                  <div className='review-rating'>
                    {renderStars(review.rating)}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!userReview && (
            <div className='write-review'>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder='Write your review...'
              />
              <div className='rating-input'>
                <label>Rating:</label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    onClick={() => setReviewRating(star)}
                    style={{
                      cursor: 'pointer',
                      color: star <= reviewRating ? '#FFD700' : '#ccc',
                      fontSize: '1.5em',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={handleReviewSubmit}
                disabled={!reviewText.trim() || reviewRating === 0}
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ViewBook
