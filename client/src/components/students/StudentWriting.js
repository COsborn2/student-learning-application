import React, { Component } from 'react'
import { SketchField, Tools } from 'react-sketch'
import { Button } from 'react-bootstrap'
import StudentApiCalls from '../../javascript/StudentApiCalls'

class StudentWriting extends Component {
  constructor (props) {
    super(props)
    this.state = { words: ['pig', 'cat', 'raccoon'] }
    this.clearCanvas = this.clearCanvas.bind(this)
    this.checkWrittenCorrectly = this.checkWrittenCorrectly.bind(this)
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

  async checkWrittenCorrectly () {
    let image64 = this._sketch.toDataURL()
    console.log(image64)
    await StudentApiCalls.checkSpelling(1, 1)
  }

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

          <Button className='btn-primary p-2 m-1' onClick={this.clearCanvas}>Clear</Button>
          <Button className='btn-primary p-2 m-1' onClick={this.checkWrittenCorrectly}>Submit</Button>
        </div>
      </div>
    )
  }
}

export default StudentWriting
