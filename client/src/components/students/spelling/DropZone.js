import React from 'react'
import { DropTarget } from 'react-dnd'

var dropZoneID = null

const Types = {
  SPELLINGCARD: 'spellingCard'
}

const dropTarget = {
  drop (props, monitor) {
    const item = monitor.getItem()
    props.parentTest(dropZoneID, item.value)
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function DropZone (props) {
  const { id, value } = props
  const { connectDropTarget } = props
  dropZoneID = id

  return connectDropTarget(
    <div key={'dropzone' + id}
      className='col-md-1 mx-1 card badge-warning'>[{id}][{value}]Drag a letter here!</div>)
}

export default DropTarget(Types.SPELLINGCARD, dropTarget, collect)(DropZone)
