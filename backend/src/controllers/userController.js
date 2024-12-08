import db from '../config/db.js' // MySQL connection

export const getUser = async (req, res) => {
  try {
    const { id } = req.headers

    const query =
      'select user_id, name, email, role, created_at from users where user_id = ?'

    let results = await db.query(query, [id])

    if (results.length == 0) {
      return res.status(400).json({ message: 'user not found' })
    }
    let user = results[0]
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
