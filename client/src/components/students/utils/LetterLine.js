import React from 'react'
import PropTypes from 'prop-types'

const LetterLine = (props) => {
  const { progress, assignments } = props
  const curAssignmentIndex = progress.curAssignmentIndex
  const curLetterIndex = progress.curLetterIndex

  let letterLine = []
  let curLetterNum = 1
  let btnStyle = ''
  let isDisabled = false

  for (let i = 0; i < assignments.length; i++) {
    for (let j = 0; j < assignments[i].letters.length; j++) {
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

      let curLetter = assignments[i].letters[j]
      let curLetterBtn =
        <button key={curLetterNum++} type='button' className='btn btn-link'
          disabled={isDisabled} onClick={() => alert(`you clicked ${curLetter}`)}>
          <span className={btnStyle}>{curLetter.toLocaleUpperCase() + curLetter}</span>
        </button>
      letterLine.push(curLetterBtn)
    }
  }
  return letterLine
}

LetterLine.propTypes = {
  progress: PropTypes.object.isRequired,
  assignments: PropTypes.array.isRequired
}

export default LetterLine
