import express from 'express'
import { authenticateToken } from '../middleware/authtoken.js'
import {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController.js'

const router = express.Router()

router.use(authenticateToken)

router.post('/', createOrder) // Create a new order
router.put('/status', updateOrderStatus) // Update the status of an order
router.get('/', getOrdersByUser) // Get all orders for the authenticated user
router.get('/admin', getAllOrders)
router.get('/:orderId', getOrderDetails) // Get details for a specific order

export default router
