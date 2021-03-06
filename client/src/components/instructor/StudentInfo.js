import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import EditStudent from './EditStudent'
import ExpandingSection from '../helpers/ExpandingSection'

/**
 * This component displays the information for the student passed as a prop
 */
class StudentInfo extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      show: true,
      showEdit: false
    }
    this.onCloseStudent = this.onCloseStudent.bind(this)
    this.onEditStudent = this.onEditStudent.bind(this)
    this.onEditSubmit = this.onEditSubmit.bind(this)
    this.onDeleteStudent = this.onDeleteStudent.bind(this)
  }

  /**
   * This is called when the close student info button is clicked
   */
  onCloseStudent () {
    this.setState({ show: false })
    this.props.onCloseStudent()
  }

  /**
   * This is called when the edit student button is clicked
   */
  onEditStudent () {
    if (this.state.showEdit) {
      this.setState({ showEdit: false })
      return
    }
    const shouldEdit = window.confirm(`Are you sure you want to edit ${this.props.student.username}?
If they are currently logged in, they will need to sign back in`)

    if (shouldEdit) { this.setState({ showEdit: true }) }
  }

  /**
   * This is called when the edit submit button is clicked
   * @param username The username to update to
   * @param password The password to update to
   */
  onEditSubmit (username, password) {
    window.alert(`The API does not support this operation yet.\nThe changes will only persist until the course is closed`)
    console.log(password)
    this.props.onEditStudent(username, password)
    this.setState({ showEdit: false })
  }

  /**
   * This is called when the delete student button is clicked
   */
  async onDeleteStudent () {
    const shouldDelete = window.confirm(`Are you sure you want to delete ${this.props.student.username}?
All of their progress will be deleted. This action cannot be undone`)

    if (shouldDelete) {
      console.log(this.props.student)
      await this.props.onDeleteStudent(this.props.student._id)
    }
  }

  /***
   * This is used to ensure the current assignment index, current word index, current letter index are all valid
   * @param valueToClamp The letter to ensure is never to large
   * @param maximum The ceiling of the number, It cannot be equal to this
   * @returns {number} The clamped number
   */
  clampValue (valueToClamp, maximum) {
    return (valueToClamp >= maximum)
      ? valueToClamp - 1
      : valueToClamp
  }

  render () {
    const { show, showEdit } = this.state
    let { student, assignments } = this.props
    let studentInfoStyle = {}
    const currentAssignment = assignments[this.clampValue(student.currentAssignment, assignments.length)]
    let currentLetter = ''
    let currentWord = ''

    if (student.finishedCourse) {
      console.log('Student has completed the course')
    } else {
      if (student.currentLetter === currentAssignment.letters.length) {
        currentLetter = <span className='text-success'>
          They have completed all letters in this assignment'
        </span>
        currentWord = <span className='text-success'>
          {currentAssignment.words[this.clampValue(student.currentWord, currentAssignment.words.length)].text}
        </span>
      } else {
        currentLetter = <span className='text-info'>
          {currentAssignment.letters[this.clampValue(student.currentLetter, currentAssignment.letters.length)]}
        </span>
        currentWord = <span className='text-warning'>
          Writing section not completed
        </span>
      }
    }
    if (!show) studentInfoStyle = { height: this._childrenRef.clientHeight } // this constrains the height of the element when it is sliding closed

    return (
      <div ref={ref => { this._childrenRef = ref }} style={studentInfoStyle} className='row'>
        <div className='col-1 mr-auto pl-1'>
          <Button className='badge-light p-1 text-center' style={{ width: '150%', height: '100%' }} onClick={() => this.onCloseStudent()}>
            ←
          </Button>
        </div>
        <div className='col text-left'>
          <div className='row mr-auto mt-1'>
            <h3 className='pl-1'>{student.username}</h3>
            <div className='flex-fill' />
            <Button className='badge-info mr-2 fa' onClick={() => this.onEditStudent()} >&#xf044;</Button>
            <Button className='badge-danger mr-2 fa' onClick={() => this.onDeleteStudent()}>&#xf014;</Button>
          </div>
          Assignment: {currentAssignment.name} <hr />
          Writing letter: {currentLetter} <hr />
          Spelling word: {currentWord}

          <ExpandingSection className='text-center border border-light' show={showEdit}>
            <EditStudent onEditSubmit={(username, password) => this.onEditSubmit(username, password)} onEditCancel={() => this.setState({ showEdit: false })} student={this.props.student} />
          </ExpandingSection>

        </div>
      </div>
    )
  }
}

StudentInfo.propTypes = {
  student: PropTypes.object.isRequired,
  assignments: PropTypes.array.isRequired,
  onDeleteStudent: PropTypes.func.isRequired,
  onEditStudent: PropTypes.func.isRequired,
  onCloseStudent: PropTypes.func.isRequired
}

export default StudentInfo
