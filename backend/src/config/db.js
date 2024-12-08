import mysql from 'mysql'
import util from 'util' // need this to properly promisift the db.query awaits
// This converts the callback-based db.query method
// into a promise-based function, enabling async/await syntax.

// connecting to mysql DB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '*****',
  database: 'bookstore',
})

db.connect((err) => {
  if (err) throw err
  console.log('Connected to MySQL database')
})

db.query = util.promisify(db.query)

export default db
