import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DropDownWithFilter from './DropDownWithFilter.js'

class Course extends Component {
  constructor (props) {
    super(props)
    let course = this.props.course // this.props.history.location.state.course//this.props.history.location.state
    // let expanded = this.props.history.location.state.expanded
    this.state = {
      course: course,
      code: course.classCode,
      name: course.className,
      students: course.students,
      assignments: course.assignments
    }
    this.onStudentSelected = this.onStudentSelected.bind(this)
    this.onAssignmentSelected = this.onAssignmentSelected.bind(this)
  }

  onStudentSelected (index) {
    console.log('student selected:  ' + index)
  }

  onAssignmentSelected (index) {
    console.log('assignment selected: ' + index)
  }

  render () {
    const students = this.state.students.map((student) => student.userName)
    const assignments = this.state.assignments.map(assignment => 'Assignment' + assignment.id)
    let outerCss = ''; let innerCss = ''
    if (this.props.show) {
      outerCss = 'course expand '
      innerCss = 'course-content expand '
    } else {
      outerCss = 'course '
      innerCss = 'course-content '
    }
    return (
      <div className={outerCss + `container badge-light rounded my-4 py-1`}>
        <div className={innerCss}>
          <h1 className='card-header rounded'>
            {this.state.name}
          </h1>
          <h2> Students </h2>
          <DropDownWithFilter category='Students' values={students} onSelected={this.onStudentSelected} />
          <h2>Assignments </h2>
          <DropDownWithFilter category='Assignments' values={assignments} onSelected={this.onAssignmentSelected} />
        </div>
      </div>
    )
  }
}

Course.propTypes = {
  match: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired
}

export default Course
