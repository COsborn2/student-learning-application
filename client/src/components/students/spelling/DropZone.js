import React from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'

let dropZoneID = null

const Types = {
  SPELLINGCARD: 'spellingCard'
}

const dropTarget = {
  drop (props, monitor) {
    const item = monitor.getItem()
    props.onDrop(dropZoneID, item.letter, item.id)
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function DropZone (props) {
  const { id, expectedLetter, currentLetter, connectDropTarget } = props
  dropZoneID = id
  let cardStyle = (currentLetter === expectedLetter) ? 'badge-success' : 'badge-danger'
  cardStyle = (currentLetter === '_') ? 'badge-warning' : cardStyle

  return connectDropTarget(
    <div key={'dropzone' + id} className={'col-md-2 mx-auto card ' + cardStyle}>
      <h5 className='card-title card badge-light '>
        {currentLetter}
      </h5>
    </div>
  )
}

DropZone.propTypes = {
  id: PropTypes.number.isRequired,
  onDrop: PropTypes.func.isRequired,
  expectedLetter: PropTypes.string.isRequired,
  currentLetter: PropTypes.string.isRequired
}

export default DropTarget(Types.SPELLINGCARD, dropTarget, collect)(DropZone)
