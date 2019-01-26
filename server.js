var isProduction = true

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  require('dotenv').load()
  console.log('development')
  isProduction = false
}

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

// var {mongoose} = require('./db/mongoose')
var { User } = require('./models/user')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API routes
app.post('/users', (req, res) => {
  var user = new User({
    email: req.body.text
  })

  user.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

if (isProduction) {
  console.log('production')
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
