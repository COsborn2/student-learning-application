import React from 'react'
import { DropTarget } from 'react-dnd'

let dropZoneID = null
let dropZoneLetterGoal = null
let dropZoneActualLetter = null

const Types = {
  SPELLINGCARD: 'spellingCard'
}

const dropTarget = {
  drop (props, monitor) {
    const item = monitor.getItem()
    props.onDrop(dropZoneID, item.value, item.id)
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function isMatched (setL, passedL) {
  if (setL === passedL) { return true } else { return false }
}

function trueFalseToWord (TF) {
  if (TF) { return 'true' } else { return 'false' }
}

function DropZone (props) {
  const { id, setLetter, passedLetter } = props
  const { isOver, connectDropTarget } = props
  dropZoneID = id
  dropZoneLetterGoal = setLetter
  dropZoneActualLetter = passedLetter
  let cardStyle = 'col-md-1 mx-1 card badge-white'

  if (isMatched(setLetter, passedLetter)) { cardStyle = 'col-md-1 mx-1 card badge-success' } else { cardStyle = 'col-md-1 mx-1 card badge-danger' }
  if (passedLetter === '[]') { cardStyle = 'col-md-1 mx-1 card badge-warning' }

  return connectDropTarget(
    <div key={'dropzone' + id}
      className={cardStyle}>
      <h5 className='card-title card badge-light'>
        {dropZoneActualLetter}
      </h5></div>)
}

export default DropTarget(Types.SPELLINGCARD, dropTarget, collect)(DropZone)
