import React from 'react'
import PropTypes from 'prop-types'

const LetterLine = (props) => {
  const { progress, letters } = props
  const curAssignmentIndex = progress.currentAssignmentIndex
  const curLetterIndex = progress.currentLetterIndex

  let letterLine = []
  let curLetterNum = 1
  let btnStyle = ''
  let isDisabled = false

  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters[i].length; j++) {
      if (i < curAssignmentIndex) {
        btnStyle = 'text-info'
      } else if (i > curAssignmentIndex) {
        btnStyle = 'text-muted'
        isDisabled = true
      } else { // else its current assignment
        if (j < curLetterIndex) {
          btnStyle = 'text-info'
        } else if (j > curLetterIndex) {
          btnStyle = 'text-muted'
          isDisabled = true
        } else btnStyle = 'text-success'
      }

      let curLetter = letters[i][j]
      let curLetterBtn =
        <button key={curLetterNum++} type='button' className='btn btn-link'
          disabled={isDisabled} onClick={() => window.alert(`you clicked ${curLetter}\n which is assignment ${i + 1} letter ${j + 1}`)}>
          <span className={btnStyle}><h1>{curLetter.toLocaleUpperCase() + curLetter}</h1></span>
        </button>
      letterLine.push(curLetterBtn)
    }
  }
  return letterLine
}

LetterLine.propTypes = {
  progress: PropTypes.object.isRequired,
  letters: PropTypes.array.isRequired
}

export default LetterLine
