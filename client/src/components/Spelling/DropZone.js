import React from 'react';

function DropZone(props)
{
  return(
    <div key={"dropzone" + props.id}
    className='col-md-1 mx-1 card badge-success'>Drag something here!</div>
  )
}

export default DropZone