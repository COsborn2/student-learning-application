import React from 'react'
import PropTypes from 'prop-types'
import DropDownWithFilter from '../helpers/DropDownWithFilter.js'
import '../../assets/css/instructorStyles.css'
import ExpandingSection from '../helpers/ExpandingSection'

class Course extends React.PureComponent {
  constructor (props) {
    super(props)
    let course = this.props.course
    console.log('course')
    console.log(this.props.course)
    this.state = {
      course: course,
      classcode: course.classcode,
      students: course.students,
      assignments: course.assignments
    }
    this.onStudentSelected = this.onStudentSelected.bind(this)
    this.onAssignmentSelected = this.onAssignmentSelected.bind(this)
  }

  onStudentSelected (index) {
    console.log('student selected: ' + index)
  }

  onAssignmentSelected (index) {
    console.log('assignment selected: ' + index)
  }

  render () {
    const students = this.state.students.map((student) => student.userName)
    const assignments = this.state.assignments.map(assignment => 'Assignment' + assignment.id)
    return (
      <ExpandingSection show={this.props.show} >
        <h1 className='card-header rounded'>
          {this.state.classcode}
        </h1>
        <h2> Students </h2>
          These are not populated yet because there is only student and assignment ids
        <DropDownWithFilter category='Students' values={students} onSelected={this.onStudentSelected} />
        <h2>Assignments </h2>
        <DropDownWithFilter category='Assignments' values={assignments} onSelected={this.onAssignmentSelected} />
      </ExpandingSection>
    )
  }
}

Course.propTypes = {
  match: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired
}

export default Course
