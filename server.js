if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API calls
app.get('/api/getData', (req, res) => { // send JSON array
  try {
    pool.query('SELECT * FROM temp_words', (err, rows) => {
      if (err) {
        console.error(err)
      } else {
        res.json(rows.rows)
      }
    })
  } catch (err) {
    console.error(err)
    res.json([{
      error: 'Database connection failure'
    }])
  }
})

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  console.log('production')
  app.use(express.static(path.join(__dirname, '/client/build')))

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
