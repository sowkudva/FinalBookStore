import express from 'express'
import { getUser } from '../controllers/userController.js'
import { authenticateToken } from '../middleware/authtoken.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/', getUser)

export default router
