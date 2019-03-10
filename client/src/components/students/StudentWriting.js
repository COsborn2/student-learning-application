import React, { Component } from 'react'
import { SketchField, Tools } from 'react-sketch'
import { Button } from 'react-bootstrap'
import StudentApiCalls from '../../javascript/StudentApiCalls'
import PropTypes from 'prop-types'
import LoadingOverlay from '../loading/LoadingOverlay'

class StudentWriting extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      isLowercase: true,
      currentLetter: this.props.letterToSpell
    }
    window.alert('This is mocked for testing right now, so it will log what tesserct detected, but will accept it regardless of correctness')
    this.clearCanvas = this.clearCanvas.bind(this)
    this.checkWrittenCorrectly = this.checkWrittenCorrectly.bind(this)
  }

  componentDidMount () { this._isMounted = true }

  componentWillUnmount () { this._isMounted = false }

  clearCanvas = () => {
    this._sketch.clear()
    this._sketch.setBackgroundFromDataUrl('')
  };

  async checkWrittenCorrectly () {
    const base64Image = this._sketch.toDataURL()

    this.setState({ isLoading: true })
    const res = await StudentApiCalls.detectWriting(this.props.jwt, base64Image)
    this.setState({ isLoading: false })

    if (res.error) {
      console.log('Some Error Calling Api From Writing')
    }

    const { currentLetter } = this.state
    const textDetected = currentLetter // res.textDetected

    // Tesseract is bad at determining case of some letters. So it converts detected text to match case
    const isMatch = (this.state.isLowercase)
      ? currentLetter === textDetected.toLocaleLowerCase()
      : currentLetter === currentLetter.toLocaleUpperCase()

    if (isMatch) {
      window.alert(`Congrats, You wrote ${res.textDetected}`)
      if (this.state.isLowercase) { // if they are on the lowercase letter, dont update progress
        this.setState({ isLowercase: false, currentLetter: currentLetter.toLocaleUpperCase() }) // advance to the same letter, but uppercase
      } else {
        await this.props.onLetterCompletion() // callback to student view signifying the current letter is written
        if (this._isMounted === true) this.setState({ isLowercase: true, currentLetter: this.props.letterToSpell })
      }
    } else {
      window.alert('Whoops, That\'s not quite correct')
    }
  }

  render () {
    const { isLoading, currentLetter } = this.state
    return (
      <div className='container p-3'>
        <LoadingOverlay show={isLoading} />
        <h1 className='text-center p-1 shadow'>Write the letter {currentLetter}</h1>
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
  letterToSpell: PropTypes.string.isRequired,
  jwt: PropTypes.string.isRequired,
  onLetterCompletion: PropTypes.func.isRequired
}

export default StudentWriting
