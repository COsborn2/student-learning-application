const Tesseract = require('tesseract.js')
const fs = require('fs')
const path = require('path')
const { InfoMessage, SuccessMessage, ErrorMessage } = require('../../middleware/message')

const tesseractOptions = {
  lang: 'eng',
  tessedit_char_blacklist: '1234567890!@#$%^&*()_+{}:"<>?`~,./;-=[];\''
}

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
      SuccessMessage(`Image saved to ${fileName}`)
      Tesseract.recognize(imagePath, tesseractOptions)
        .then(data => {
          SuccessMessage(`Text detected: ${data.text}`)
          res.send({ textDetected: data.text })
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