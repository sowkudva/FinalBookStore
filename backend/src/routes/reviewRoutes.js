import express from 'express'
import { authenticateToken } from '../middleware/authtoken.js'
import {
  getAllReviews,
  getUserReview,
  addReview,
} from '../controllers/reviewController.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/by-book/:book_id', getAllReviews)
router.get('/by-book/:book_id/user', authenticateToken, getUserReview)
router.post('/by-book/:book_id', authenticateToken, addReview)

export default router
