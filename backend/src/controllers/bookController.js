import db from '../config/db.js'
import { extractClaims } from '../middleware/authtoken.js'

const getBookById = async (book_id) => {
  const query = `
    SELECT 
      b.book_id, 
      b.title, 
      b.price,
      b.genre,
      b.description,
      b.stock_quantity,
      b.created_at,
      b.url,
      b.updated_at,
      a.name as author
    FROM books b
    JOIN author a ON a.id = b.authorID 
    WHERE b.book_id = ?
    ORDER BY created_at DESC
  `

  const results = await db.query(query, [book_id])
  return results
}

export const fetchBooks = async (req, res) => {
  const query = `SELECT 
  b.book_id, 
  b.title, 
  b.price,
  b.genre,
  b.description,
  b.stock_quantity,
  b.created_at,
  b.url,
  b.updated_at,
  a.name as author
  FROM books b
  join author a on a.id = b.authorID 
  order by created_at desc`

  try {
    const results = await db.query(query)
    return res.json(results)
  } catch (error) {
    return res.status(500).json({ message: 'internal server error' })
  }
}

export const fetchBookById = async (req, res) => {
  try {
    const book_id = req.params.book_id
    if (!book_id) {
      res.status(400).json({ message: 'book id is required' })
    }
    let results = await getBookById(book_id)

    if (results.length == 0) {
      return res.status(400).json({ message: 'no books found for the id' })
    }

    return res.status(200).json(results[0])
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: 'internal server error ' })
  }
}

export const removeBook = async (req, res) => {
  const { userId, userName } = extractClaims(req.user.authClaims)
  const bookId = req.params.book_id

  if (userName !== 'admin') {
    return res.status(403).json({
      message: 'error in user access, only admin user can remove books',
    })
  }

  try {
    let results = await getBookById(bookId)

    if (results.length === 0) {
      return res.status(404).json({ message: 'no books found for the id' })
    }

    const query = 'DELETE FROM books WHERE book_id = ?'
    await db.query(query, [bookId])

    return res.status(200).json({ message: 'Book removed successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'internal server error' })
  }
}
