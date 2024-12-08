import express from 'express'
import {
  addToCart,
  getCartItems,
  removeFromCart,
} from '../controllers/cartController.js'
import { authenticateToken } from '../middleware/authtoken.js'

const router = express.Router()

router.use(authenticateToken)

router.post('/', addToCart)
router.get('/', getCartItems)
router.delete('/:book_id', removeFromCart)

export default router
