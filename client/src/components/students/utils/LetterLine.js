import React from 'react'
import PropTypes from 'prop-types'

/**
 * This is the letter line that allows a student to go back and redo previous sections
 * @param letterLineInfo The information containing what letters correspond to which assignment and letter index
 * @param onLetterLineSelection The callback method to fire when a letter is clicked
 * @returns {Array} Returns the letter line to render
 */
const LetterLine = ({ letterLineInfo, onLetterLineSelection }) => {
  const { assignmentIds, unlockedAssignmentIndex, unlockedLetterIndex, selectedAssignmentIndex, selectedLetterIndex } = letterLineInfo

  let letterLine = []
  let curLetterNum = 1
  let btnStyle = ''
  let isDisabled = false

  for (let i = 0; i < assignmentIds.length; i++) {
    for (let j = 0; j < assignmentIds[i].letters.length; j++) {
      if (i < unlockedAssignmentIndex) { // this if/else block determines style based on users progress
        btnStyle = 'text-info'
      } else if (i > unlockedAssignmentIndex) {
        btnStyle = 'text-muted'
        isDisabled = true
      } else { // if it is the unlocked assignment
        if (j <= unlockedLetterIndex) {
          btnStyle = 'text-info'
        } else if (j > unlockedLetterIndex) {
          btnStyle = 'text-muted'
          isDisabled = true
        }
      }

      if (i === selectedAssignmentIndex && j === selectedLetterIndex) { // this assigns success style if its selected
        btnStyle = 'text-success'
      }

      let curLetter = assignmentIds[i].letters[j]
      let curLetterBtn =
        <button key={curLetterNum++} type='button' className='btn btn-link'
          disabled={isDisabled} onClick={() => onLetterLineSelection(i, j)}>
          <span className={btnStyle}><h1>{curLetter.toLocaleUpperCase() + curLetter}</h1></span>
        </button>
      letterLine.push(curLetterBtn)
    }
  }
  return letterLine
}

LetterLine.propTypes = {
  letterLineInfo: PropTypes.object.isRequired
}

export default LetterLine
