import app from './app.js'

app.get('/', (req, res) => {
  res.json('hello this is the backend')
})

app.listen(8800, () => {
  console.log('Connected to backend success')
})
