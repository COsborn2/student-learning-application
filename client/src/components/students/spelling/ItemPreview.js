import React from 'react'
import PropTypes from 'prop-types'
import { DragLayer } from 'react-dnd'

function collect (monitor) {
  let item = monitor.getItem()
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

  let x = currentOffset.x
  let y = currentOffset.y
  let transform = `translate(${x}px, ${y}px)`

  return {
    pointerEvents: 'none',
    transform: transform,
    WebkitTransform: transform,
    boxShadow: '5px 5px 5px 1px #6b6b6b',
    background: '#4085bd',
    padding: '20%'
  }
}

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '5%'
}

function ItemPreview ({
  id,
  isDragging,
  currentOffset,
  value
}) {
  if (!isDragging) {
    return <div />
  }

  return (
    <div style={layerStyles}>
      <div key={id}
        style={getItemStyles(currentOffset)}
        className='mx-auto rounded'>
        <h5 className='mx-auto'>
          {value}
        </h5>
      </div>
    </div>
  )
}

ItemPreview.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  value: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  isDragging: PropTypes.bool
}

export default DragLayer(collect)(ItemPreview)
