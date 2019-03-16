import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class StudentInfo extends PureComponent {
  render () {
    console.log('student info student: ')
    console.log(this.props.student)
    return (
      <div className='col'>
        Username: {this.props.student.username} <br />
        Current Assignment: {this.props.student.currentAssignment} <br />
        Current Letter: {this.props.student.currentLetter} <br />
      </div>
    )
  }
}

StudentInfo.propTypes = {
  student: PropTypes.object.isRequired
}

export default StudentInfo
