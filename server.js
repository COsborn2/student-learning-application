const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API calls
app.get('/api/getData', (req, res) => {
  res.json([{
    id: 1,
    username: 'username1'
  }, {
    id: 2,
    username: 'username2'
  }])
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
