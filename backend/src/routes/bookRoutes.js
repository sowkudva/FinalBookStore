import express from 'express'
import { fetchBooks, fetchBookById } from '../controllers/bookController.js'

const router = express.Router()

router.get('/', fetchBooks)
router.get('/:book_id', fetchBookById)

export default router
