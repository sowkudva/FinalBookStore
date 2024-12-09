import express from 'express'
import {
  fetchBooks,
  fetchBookById,
  removeBook,
} from '../controllers/bookController.js'
import { authenticateToken } from '../middleware/authtoken.js'

const router = express.Router()

router.get('/', fetchBooks)
router.get('/:book_id', fetchBookById)
router.delete('/:book_id', authenticateToken, removeBook)

export default router
