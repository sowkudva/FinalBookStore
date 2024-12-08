import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import './BookCard.css'

const BookCard = ({ book }) => {
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(false)
  const isLoggedIn = !!localStorage.getItem('token')

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10)
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8800/api/v1/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          auth: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book_id: book.book_id,
          quantity,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      alert('Added to cart successfully!')
    } catch (error) {
      alert('Failed to add to cart.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='book-card'>
      <Link to={`/view-book/${book.book_id}`} key={book.id}>
        <div className='book-image'>
          <img src={book.url} alt={book.title} />
        </div>
        <div className='book-meta'>
          <h2>{book.title}</h2>
          <p>Author: {book.author}</p>
          <p>Price: ${book.price}</p>
        </div>
      </Link>
      {isLoggedIn ? (
        <>
          <div className='quantity-controls'>
            <div className='quantity-dropdown'>
              <label htmlFor={`quantity-${book.book_id}`}>Quantity:</label>
              <select
                id={`quantity-${book.book_id}`}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={loading}
              >
                <option value='0'>0</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={loading || quantity === 0}
            className='add-to-cart-btn'
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default BookCard
