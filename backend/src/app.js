import express from 'express'
import bookRoutes from './routes/bookRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import cors from 'cors'

const corsOptions = {
  origin: 'http://localhost:3000', // Frontend origin
  credentials: true,
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())

// Routes to let app.js know the routes called from postman
app.use('/api/v1/books', bookRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/reviews', reviewRoutes)

export default app
