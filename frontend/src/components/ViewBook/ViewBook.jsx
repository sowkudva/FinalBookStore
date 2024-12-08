import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ViewBook.css'

const ViewBook = () => {
  const { book_id } = useParams()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isLoggedIn = !!localStorage.getItem('token')
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
          body: JSON.stringify({ review: reviewText }),
        }
      )
      const newReview = await response.json()

      setReviews([...reviews, newReview])
      setUserReview(newReview)
      setReviewText('')
    } catch (err) {
      alert('Failed to submit review')
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
            <strong>Stock:</strong> {book.stock_qty} copies available
          </p>
          <p>
            <strong>Description:</strong>
            {book.description}
          </p>
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
              <button
                onClick={handleReviewSubmit}
                disabled={!reviewText.trim()}
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
