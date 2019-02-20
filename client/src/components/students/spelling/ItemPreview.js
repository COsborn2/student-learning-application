/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import DragLayer from 'react-dnd/lib/DragLayer'

function collect (monitor) {
  var item = monitor.getItem()
  return {
    id: item && item.id,
    name: item && item.name,
    value: item && item.value,
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}
/*
function getItemStyles (currentOffset) {
  if (!currentOffset) {
    return {
      display: 'none'
    }
  }

  // http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
  var x = currentOffset.x
  var y = currentOffset.y
  var transform = `translate(${x}px, ${y}px)`

  return {
    pointerEvents: 'none',
    transform: transform,
    WebkitTransform: transform
  }
}
*/
function ItemPreview ({
  id,
  name,
  isDragging,
  currentOffset,
  value
}) {
  if (!isDragging) {
    return null
  }

  return (
    <div key={id}
      className='mx-1 col-md-1 card badge-success'>
      <h5 className='card-title card badge-light'>
        {value}
      </h5>
    </div>
  )
}

ItemPreview.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  isDragging: PropTypes.bool
}

export default DragLayer(collect)(ItemPreview)
