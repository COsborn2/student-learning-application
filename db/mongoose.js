var mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
mongoose.set('useCreateIndex', true)

console.log('Mongo connected')

module.exports = { mongoose }
