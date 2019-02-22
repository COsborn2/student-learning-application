const mongoose = require('mongoose')
const { SuccessMessage } = require('../middleware/message')

mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

SuccessMessage('Mongo connected')

module.exports = { mongoose }
