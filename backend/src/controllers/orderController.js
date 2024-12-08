import db from '../config/db.js'
import { extractClaims } from '../middleware/authtoken.js'

export const createOrder = async (req, res) => {
  const { items } = req.body // Items: [{ book_id, quantity, price }]
  const { userId } = extractClaims(req.user.authClaims) // Use user ID from the token

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' })
  }

  try {
    await db.query('START TRANSACTION')
    // Calculate total price
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )

    // Insert order
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_price, status, created_at, updated_at)
       VALUES (?, ?, 'pending', NOW(), NOW())`,
      [userId, totalPrice]
    )
    const orderId = orderResult.insertId

    // Insert order items
    const orderItemsQuery = `
      INSERT INTO order_items (order_id, book_id, quantity, price)
      VALUES ?
    `
    const orderItemsData = items.map((item) => [
      orderId,
      item.book_id,
      item.quantity,
      item.price,
    ])
    await db.query(orderItemsQuery, [orderItemsData])

    await db.query('COMMIT')

    const clearCartQuery = `DELETE FROM cart WHERE user_id = ?`
    await db.query(clearCartQuery, [userId])

    res.status(201).json({ message: 'Order created successfully', orderId })
  } catch (error) {
    await db.query('ROLLBACK')

    console.error('Error creating order:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getAllOrders = async (req, res) => {
  const { userId, userName } = extractClaims(req.user.authClaims) // Use user ID from the token
  if (userName !== 'admin')
    res.status(400).json({ message: 'Only admin can access ' })

  try {
    const orders = await db.query(`
      SELECT 
        o.id AS order_id,
        o.created_at,
        o.total_price,
        o.status,
        u.name AS user_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
    `)

    return res.status(200).json({ orders })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getOrdersByUser = async (req, res) => {
  const { userId } = extractClaims(req.user.authClaims) // Use user ID from the token

  try {
    const orders = await db.query(
      `SELECT o.id, o.total_price, o.status, o.created_at, o.updated_at
       FROM orders o
       WHERE o.user_id = ?`,
      [userId]
    )

    res.status(200).json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getOrderDetails = async (req, res) => {
  const { orderId } = req.params

  try {
    const [order] = await db.query(
      `SELECT o.id, o.total_price, o.status, o.created_at, o.updated_at
       FROM orders o
       WHERE o.id = ?`,
      [orderId]
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const items = await db.query(
      `SELECT oi.book_id, b.title, oi.quantity, oi.price
       FROM order_items oi
       JOIN books b ON oi.book_id = b.book_id
       WHERE oi.order_id = ?`,
      [orderId]
    )

    res.status(200).json({ order, items })
  } catch (error) {
    console.error('Error fetching order details:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body

  if (
    !['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(
      status
    )
  ) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  try {
    const result = await db.query(
      `UPDATE orders
       SET status = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, orderId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Fetch the updated order
    const [updatedOrder] = await db.query(
      `SELECT id, total_price, status, created_at, updated_at
       FROM orders
       WHERE id = ?`,
      [orderId]
    )

    res.status(200).json({
      order: updatedOrder,
      message: 'Order status updated successfully',
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
