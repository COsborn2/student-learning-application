import React from 'react';
import { DropTarget } from 'react-dnd';

const Types = {
  SPELLINGCARD: 'spellingCard'
}

const dropTarget = {
  drop(props, monitor){
    const item = monitor.getItem();
    alert(item.value);
    //Research way to pass it to student spelling
  }
}

function collect(connect, monitor)
{
  return{
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

function DropZone(props)
{
  const {id} = props;
  const {isOver, connectDropTarget} = props;

  if(!isOver)
    return connectDropTarget(
      <div key={"dropzone" + id}
      className='col-md-1 mx-1 card badge-warning'>Drag something here!</div>
    )
  else
  return connectDropTarget(
    <div key={"dropzone" + id}
    className='col-md-1 mx-1 card badge-success'>Drag something here!</div>
  )
}

export default DropTarget(Types.SPELLINGCARD, dropTarget, collect)(DropZone);