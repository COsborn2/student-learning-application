// Colors pulled from here: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

const redText = '\x1b[31m%s\x1b[0m'
const greenText = '\x1b[32m%s\x1b[0m'
const yellowText = '\x1b[33m%s\x1b[0m'
const normalText = '%s'

let ErrorMessage = (message) => {
  console.log(redText, 'Error: ' + message)
}

let SuccessMessage = (message) => {
  console.log(greenText, 'Success: ' + message)
}

let WarningMessage = (message) => {
  console.log(yellowText, 'Warning: ' + message)
}

let InfoMessage = (message) => {
  console.log(normalText, 'Info: ' + message)
}

module.exports = { ErrorMessage, SuccessMessage, WarningMessage, InfoMessage }
