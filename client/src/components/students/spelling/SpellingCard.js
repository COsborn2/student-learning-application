import React from 'react'
import { DragSource } from 'react-dnd'

const Types = {
  SPELLINGCARD: 'spellingCard'
}

const spellingCardSource = {
  beginDrag (props) {
    const item = { id: props.id,
      value: props.value }
    return item
  },

  endDrag (props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function SpellingCard (props) {
  const { id, value } = props
  const { isDragging, connectDragSource } = props

  if (!isDragging) {
    return connectDragSource(
      <div key={id}
        // onClick={props.onClick}
        className='mx-1 col-md-1 card badge-success'>
        <h5 className='card-title card badge-light'>
          {value}
        </h5>
      </div>
    )
  } else {
    return connectDragSource(
      <div key={id}
      // onClick={props.onClick}
        className='mx-1 col-md-1' />
    )
  }
}

export default DragSource(Types.SPELLINGCARD, spellingCardSource, collect)(SpellingCard)

// export default SpellingCard
