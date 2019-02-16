const _ = require('lodash')
const { Word } = require('../models/word')

let createWord = async (req, res) => {
  let body = _.pick(req.body, ['text', 'picture'])

  let word = new Word({
    text: body.text,
    picture: body.picture
  })

  await word.save()
  return res.send(word)
}

module.exports = { createWord }