const Tesseract = require('tesseract.js')
const fs = require('fs')
const path = require('path')
const { InfoMessage, SuccessMessage, ErrorMessage } = require('../../middleware/message')

const detectImageText = async (req, res) => {
  InfoMessage('Detecting text in image')
  let imageReceived = req.body.image

  if (!imageReceived) {
    ErrorMessage('No image received')
    return res.status(400).send({ error: 'An image is required' })
  }

  let fileName = 'tesseractInputImage.png'
  let imagePath = path.join(__dirname, fileName)
  let base64Data = imageReceived.replace(/^data:image\/png;base64,/, '')

  try {
    await fs.writeFile(imagePath, base64Data, 'base64', () => {
      SuccessMessage(`Image saved to ${imagePath}`)
      Tesseract.recognize(imagePath, { 1: 'eng' })
        .then(data => {
          SuccessMessage(`Text detected: ${data.text}`)
          res.send(data.text)
        })
        .catch(err => {
          ErrorMessage(`Text detection error: ${err}`)
          res.status(400).send({ error: err })
        })
    }, (err) => {
      ErrorMessage(`Error writing to tesseract input file: ${err}`)
      res.status(500).send({ error: 'An unexpected error occurred' })
    })
  } catch (err) {
    ErrorMessage(err)
    res.status(400).send({ error: 'An unexpected error occurred' })
  }
}

module.exports = { detectImageText }
