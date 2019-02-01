import React, { Component } from 'react'
import { SketchField, Tools } from 'react-sketch'
import { Button, ListGroupItem, ListGroup } from 'react-bootstrap'

class StudentWriting extends Component {
  constructor (props) {
    super(props)
    this.state = { words: ['pig', 'cat', 'raccoon'] }
  }

  componentDidMount () {
    // fetch('/api/getData')
    //   .then(res => res.json())
    //   .then(wordItems => {
    //     let updatedWords = this.state.words
    //     wordItems.map(wordItem => updatedWords.push(wordItem.word))
    //     this.setState({ words: updatedWords })
    //   })
  }

  clearCanvas = () => {
    this._sketch.clear()
    this._sketch.setBackgroundFromDataUrl('')
  };

  render () {
    return (
      <div className='container p-3'>
        <h1 className='text-center p-1 shadow'>Writing</h1>
        <div className='bg-dark'>
          <SketchField
            className='badge-info'
            ref={ref => (this._sketch = ref)}
            tool={Tools.Pencil}
            lineColor='black'
            lineWidth={10} />

          <Button bsStyle='primary' className='p-2 m-1' onClick={this.clearCanvas}>Clear</Button>
        </div>

        <div className='card col-md-4 m-4 shadow-lg text-center'>
          <div className='card-title'> <h1 className='display-4 font-weight-bold'>Words To Write</h1 ></div>
          <div className='card-body'>
            <ListGroup>
              {this.state.words.map(curWord =>
                <ListGroupItem key={curWord}>{curWord}</ListGroupItem>
              )}
            </ListGroup>
          </div>
        </div>
      </div>
    )
  }
}

export default StudentWriting
