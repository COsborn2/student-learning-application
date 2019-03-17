import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

/**
 * This component displays information about the assignment passed as a prop
 */
class AssignmentInfo extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      show: true
    }
    this.onCloseAssignment = this.onCloseAssignment.bind(this)
  }

  /**
   * This is called when the close button is clicked
   */
  onCloseAssignment () {
    this.setState({ show: false })
    this.props.onCloseAssignment()
  }

  render () {
    const { show } = this.state
    const { assignment } = this.props
    let assignmentInfoStyle = {}
    if (!show) assignmentInfoStyle = { height: this._childrenRef.clientHeight } // this constrains the height of the element when it is sliding closed

    return (
      <div ref={ref => { this._childrenRef = ref }} style={assignmentInfoStyle} className='row'>
        <div className='col-1 mr-auto pl-1'>
          <Button className='badge-light p-1 text-center' style={{ width: '150%', height: '100%' }} onClick={() => this.onCloseAssignment()}>
            ←
          </Button>
        </div>
        <div className='col text-left'>

          <h3>{assignment.name}</h3> <hr />
          Writing letters
          <ul>
            {assignment.letters.map((letter, index) => <li key={index}>{letter}</li>)}
          </ul>
          <hr />
          Spelling words
          <ul>
            {assignment.words.map((word, index) => <li key={index}>{word.text}</li>)}
          </ul>
        </div>
      </div>
    )
  }
}

AssignmentInfo.propTypes = {
  assignment: PropTypes.object.isRequired,
  onCloseAssignment: PropTypes.func.isRequired
}

export default AssignmentInfo
