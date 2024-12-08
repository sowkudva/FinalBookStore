import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AllBooks.css'
import BookCard from '../components/BookCard/BookCard'

const AllBooks = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/v1/books')
        setBooks(response.data)
      } catch (err) {
        setError('Failed to fetch books')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (loading) return <div>Loading books...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='books-container'>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <div className='book-cards'>
          {books.map((book) => (
            <BookCard book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AllBooks
