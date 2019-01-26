import React from 'react';
import { DragSource } from 'react-dnd';

const Types = {
    SPELLINGCARD: 'spellingCard'
  }
  
const spellingCardSource = {
    beginDrag(props)
    {
      const item = { id: props.id };
      return item;
    },
  
    endDrag(props, monitor, component)
    {
      if(!monitor.didDrop())
      {
        return;
      }
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
    }
}

function collect(connect, monitor)
{
    return{
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}


function SpellingCard (props) 
{
  const {id} = props;
  const {isDragging, connectDragSource} = props;

  return (
    <div key={props.id}
      onClick={props.onClick}
      className='mx-1 col-md-1 card badge-success'>
      <h5 className='card-title card badge-light'>
        {props.value}
      </h5>
    </div>
  )
}

export default DragSource(Types.SPELLINGCARD, spellingCardSource, collect)(SpellingCard);

//export default SpellingCard