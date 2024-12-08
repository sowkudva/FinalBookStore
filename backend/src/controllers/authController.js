import bcrypt from 'bcryptjs' // For password hashing
import db from '../config/db.js' // MySQL connection
import jwt from 'jsonwebtoken' // this is needed to create tokens and pas them around

export const SignUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    //validate
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ code: 400, message: 'All feilds are required' })
    }

    const emailcheck = 'SELECT * from USERS where email = ?'

    let results = await db.query(emailcheck, [email])

    if (results.length > 0) {
      return res
        .status(400)
        .json({ code: 400, message: 'email is already registered' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user into the database
    const insertQuery =
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    results = await db.query(insertQuery, [name, email, hashedPassword, role])

    return res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email is already registered' })
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res
        .status(500)
        .json({ message: 'Database schema error. Please contact support.' })
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ message: 'Database access denied' })
    }

    // Log unknown errors
    console.error('Unexpected error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const SignIn = async (req, res) => {
  try {
    const { name, password } = req.body

    // Validate input
    if (!name || !password) {
      return res
        .status(400)
        .json({ code: 400, message: 'Username and password are required' })
    }

    // Query database for the user
    const existingUserQuery =
      'SELECT user_id, name, password, role FROM users WHERE name = ?'
    let results = await db.query(existingUserQuery, [name])

    // Check if user exists
    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' })
    }

    const user = results[0]

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({ code: 401, message: 'Invalid password' })
    }

    // if passewords match, need to create the tokens using some key chars of users
    // we are using id, name & role
    const authClaims = [
      { id: user.user_id },
      { name: user.name },
      { role: user.role },
    ]

    const token = jwt.sign({ authClaims }, 'bookstore123', {
      expiresIn: '30d',
    })

    // If credentials are valid
    res.status(200).json({
      message: 'Sign-in successful',
      id: user.user_id,
      token: token,
      name: user.name,
    })
  } catch (error) {
    console.error('Sign-in error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
