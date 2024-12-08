import db from '../config/db.js'
import { extractClaims } from '../middleware/authtoken.js'

// Get all reviews for a specific book
export const getAllReviews = (req, res) => {
  const bookId = req.params.book_id
  const query = `
    SELECT r.id, r.text, u.name AS user_name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.user_id 
    WHERE r.book_id = ?
  `

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
    res.json(results)
  })
}

// Get the current user's review for a specific book
export const getUserReview = (req, res) => {
  const { userId } = extractClaims(req.user.authClaims) // Use user ID from the token
  const bookId = req.params.book_id

  const query = 'SELECT * FROM reviews WHERE book_id = ? AND user_id = ?'
  db.query(query, [bookId, userId], (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
    res.json(results[0] || { review: null })
  })
}

// Add a new review
export const addReview = async (req, res) => {
  const { userId, userName } = extractClaims(req.user.authClaims) // Use user ID from the token
  const bookId = req.params.book_id
  const { review } = req.body

  if (!review) {
    return res.status(400).json({ message: 'Review cannot be empty' })
  }

  const query = 'INSERT INTO reviews (book_id, user_id, text) VALUES (?, ?, ?)'
  const results = await db.query(query, [bookId, userId, review])

  res
    .status(201)
    .json({ id: results.insertId, text: review, user_name: userName })
}
