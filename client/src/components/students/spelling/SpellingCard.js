import React from 'react'
import { DragSource } from 'react-dnd'
import PropTypes from 'prop-types'

const Types = {
  SPELLINGCARD: 'spellingCard'
}

const spellingCardSource = {
  beginDrag (props) {
    return { id: props.id, letter: props.letter }
  },

  endDrag (props, monitor) {
    if (monitor.didDrop()) {
      monitor.getItem()
      monitor.getDropResult()
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function SpellingCard (props) {
  const { id, letter, isDragging, connectDragSource } = props

  if (!isDragging) {
    return connectDragSource(
      <div key={id} className='col-md-2 mx-auto card badge-success'>
        <h5 className='card-title card badge-light'>
          {letter}
        </h5>
      </div>
    )
  } else {
    return connectDragSource(<div key={id} className='mx-1 col-md-1' />)
  }
}

SpellingCard.proptypes = {
  id: PropTypes.number.isRequired,
  key: PropTypes.number.isRequired,
  letter: PropTypes.string.isRequired
}

export default DragSource(Types.SPELLINGCARD, spellingCardSource, collect)(SpellingCard)

// export default SpellingCard
