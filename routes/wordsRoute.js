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

let updateWord = async (req, res) => {
  let body = _.pick(req.body, ['text'], ['newText'])

  let newWord = await Word.findOneAndUpdate({ 
    text: body.text 
  }, {
    text: body.newText
  }, { 
    new: true 
  })

  return res.send(newWord)
}

module.exports = { createWord, updateWord }
