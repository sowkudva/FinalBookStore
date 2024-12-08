import express from 'express'
import {
  fetchBooks,
  fetchBooksByAuthor,
  fetchBookById,
} from '../controllers/bookController.js'

const router = express.Router()

// Fetch all books
router.get('/', fetchBooks)

router.get('/by-author', fetchBooksByAuthor)

router.get('/:book_id', fetchBookById)

// Add a new book
// router.post('/', addBook)

export default router
