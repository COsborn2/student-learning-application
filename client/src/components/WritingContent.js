import React, { Component } from 'react'
import { SketchField, Tools } from 'react-sketch'
import { Button } from 'react-bootstrap'

class WritingContent extends Component {
  clearCanvas = () => {
    console.log('clear')
    this._sketch.clear()
    this._sketch.setBackgroundFromDataUrl('')
  };

  render () {
    return (
      <div>
        <h1 className='text-center shadow'>Writing</h1>
        <div className='bg-dark m-5'>
          <SketchField
            className='badge-info'
            ref={c => (this._sketch = c)}
            tool={Tools.Pencil}
            lineColor='black'
            lineWidth={10} />

          <Button bsStyle='primary' className='p-2 m-1' onClick={this.clearCanvas}>Clear</Button>
        </div>
      </div>
    )
  }
}

export default WritingContent
