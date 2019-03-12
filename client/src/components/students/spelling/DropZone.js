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
  let cardColor = (currentLetter === expectedLetter) ? 'green' : 'red'
  cardColor = (currentLetter === '_') ? 'white' : cardColor

  return connectDropTarget(
    <div key={'dropzone' + id} className='mx-auto' style={{ background: cardColor, width: '8%', padding: '1%' }}>
      <h5 className='mx-auto'>
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
