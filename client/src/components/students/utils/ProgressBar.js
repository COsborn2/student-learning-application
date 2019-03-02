import React from 'react'
import StudentApiCalls from '../../../javascript/StudentApiCalls'

const Alphabet = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'

function constructProgressBar (progress) {
  let progressBar = []

  for (let i = 0; i < Alphabet.length; i = i + 2) {
    let button = Alphabet[i]
    if (i / 2 === progress.curLetterIndex) { // Current letter should be marked Green
      button = <button type='button' class='btn btn-link'><span class='text-success'>{Alphabet[i]}{Alphabet[i + 1]}</span></button>
    } else if (i / 2 <= progress.curAssignmentIndex) { // Unlocked assignments should be marked Blue
      button = <button type='button' class='btn btn-link'><span class='text-info'>{Alphabet[i]}{Alphabet[i + 1]}</span></button>
    } else { // Mark the rest as Gray
      button = <button type='button' class='btn btn-link'><span class='text-muted'>{Alphabet[i]}{Alphabet[i + 1]}</span></button>
    }
    progressBar.push(button)
  }

  return progressBar
}

function ProgressBar (props) {
  let { jwt } = props

  let progress = StudentApiCalls.getProgress(jwt)

  return constructProgressBar(progress)
}

export default ProgressBar
