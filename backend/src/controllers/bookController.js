import db from '../config/db.js'

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
  where b.book_id=?
  order by created_at desc`

    let results = await db.query(query, [book_id])
    if (results.length == 0) {
      return res.status(400).json({ message: 'no books found for the id' })
    }

    return res.status(200).json(results[0])
  } catch (error) {
    return res.status(500).json({ message: 'internal server error ' })
  }
}
