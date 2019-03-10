import React, { Component } from 'react'
import { SketchField, Tools } from 'react-sketch'
import { Button } from 'react-bootstrap'
import StudentApiCalls from '../../javascript/StudentApiCalls'
import PropTypes from 'prop-types'

class StudentWriting extends Component {
  constructor (props) {
    super(props)
    this.clearCanvas = this.clearCanvas.bind(this)
    this.checkWrittenCorrectly = this.checkWrittenCorrectly.bind(this)
  }

  clearCanvas = () => {
    this._sketch.clear()
    this._sketch.setBackgroundFromDataUrl('')
  };

  async checkWrittenCorrectly () {
    const base64Image = this._sketch.toDataURL()

    const res = await StudentApiCalls.detectWriting(this.props.jwt, base64Image)
    if (res.error) {
      console.log('Some Error Calling Api From Writing')
    }
    let textDetected = res.textDetected
    window.alert(`Text detected: ${textDetected}`)
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

StudentWriting.propTypes = {
  lettersToSpell: PropTypes.array.isRequired,
  jwt: PropTypes.string.isRequired,
  onLetterCompletion: PropTypes.func.isRequired
}

export default StudentWriting
