import db from '../config/db.js'
import { extractClaims } from '../middleware/authtoken.js'

export const addToCart = async (req, res) => {
  try {
    const { book_id, quantity } = req.body
    const { userId } = extractClaims(req.user.authClaims)

    if (!book_id || !quantity) {
      return res
        .status(400)
        .json({ message: 'Book ID and quantity are required' })
    }

    const query = `
      INSERT INTO cart (user_id, book_id, quantity, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity),
        updated_at = NOW()
    `
    await db.query(query, [userId, book_id, quantity])

    res.status(201).json({ message: 'Book added to cart successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'internal server error' })
  }
}

// Get all cart items for the authenticated user
export const getCartItems = async (req, res) => {
  try {
    const { userId } = extractClaims(req.user.authClaims)
    const query = `
      SELECT c.id, c.quantity, b.book_id, b.title, a.name, b.price
      FROM cart c
      JOIN books b ON c.book_id = b.book_id
      join author a on a.id = b.authorID
      WHERE c.user_id = ?
    `
    const items = await db.query(query, [userId])

    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Remove a book from the cart
export const removeFromCart = async (req, res) => {
  try {
    const { book_id } = req.params
    const { userId } = extractClaims(req.user.authClaims) // Get the user ID from the token

    if (!book_id) {
      return res.status(400).json({ message: 'Book ID is required' })
    }

    const query = `
      DELETE FROM cart
      WHERE user_id = ? AND book_id = ?
    `
    const result = await db.query(query, [userId, book_id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    res.status(200).json({ message: 'Book removed from cart successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
