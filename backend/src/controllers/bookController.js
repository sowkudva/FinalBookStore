import db from '../config/db.js'

export const fetchBooks = (req, res) => {
  const query = 'SELECT * FROM books order by created_at desc'
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching books' })
    }
    res.json(results)
  })
}

export const addBook = (req, res) => {
  const { title, author, price, stock } = req.body

  if (!title || !author || !price || stock == null) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const query =
    'INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)'
  db.query(query, [title, author, price, stock], (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: 'Error adding book' })
    }
    res.status(201).json({ message: 'Book added', bookId: results.insertId })
  })
}

export const fetchBooksByAuthor = async (req, res) => {
  try {
    const { author } = req.query
    if (!author) {
      res.status(400).json({ message: 'author name is required' })
    }
    const query = 'select * from books where author = ?'

    let results = db.query(query, [author])
    if (results.length == 0) {
      return res.status(400).json({ message: 'no books found for the author' })
    }
    return res.status(200).json(results)
  } catch (error) {
    return res.status(500).json({ message: 'internal server error ' })
  }
}

export const fetchBookById = async (req, res) => {
  try {
    const book_id = req.params.book_id
    if (!book_id) {
      res.status(400).json({ message: 'book id is required' })
    }
    const query = 'select * from books where book_id = ?'

    let results = await db.query(query, [book_id])
    if (results.length == 0) {
      return res.status(400).json({ message: 'no books found for the id' })
    }

    return res.status(200).json(results[0])
  } catch (error) {
    return res.status(500).json({ message: 'internal server error ' })
  }
}
