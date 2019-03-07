import React from 'react'
import PropTypes from 'prop-types'
import DragLayer from 'react-dnd/lib/DragLayer'

function collect (monitor) {
  var item = monitor.getItem()
  return {
    id: item && item.id,
    name: item && item.name,
    value: item && item.letter,
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}

function getItemStyles (currentOffset) {
  if (!currentOffset) {
    return {
      display: 'none'
    }
  }

  var x = currentOffset.x
  var y = currentOffset.y
  var transform = `translate(${x}px, ${y}px)`

  return {
    pointerEvents: 'none',
    transform: transform,
    WebkitTransform: transform
  }
}

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

function ItemPreview ({
  id,
  isDragging,
  currentOffset,
  value
}) {
  if (!isDragging) {
    return null
  }

  return (
    <div style={layerStyles}>
      <div key={id}
        style={getItemStyles(currentOffset)}
        className='mx-1 col-md-1 card badge-success'>
        <h5 className='card-title card badge-light'>
          {value}
        </h5>
      </div>
    </div>
  )
}

ItemPreview.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  isDragging: PropTypes.bool
}

export default DragLayer(collect)(ItemPreview)
