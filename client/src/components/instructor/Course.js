import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/instructorStyles.css'
import ExpandingSection from '../helpers/ExpandingSection'
import FilteredList from '../helpers/FilteredList'

class Course extends React.PureComponent {
  constructor (props) {
    super(props)
    let course = this.props.course
    console.log('course')
    console.log(this.props.course)
    this.state = {
      course: course,
      classcode: course.classcode,
      studentIds: course.students,
      assignmentIds: course.assignments
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
    const { studentIds, assignmentIds, classcode } = this.state
    const studentFilter = studentIds.length === 0
      ? <header className='bg-white rounded-lg w-75 text-center'>There are no students in this course yet</header>
      : <FilteredList items={studentIds.map((studentId, index) => `Student ${index + 1}`)} onItemClick={index => this.onStudentSelected(index)} />

    const assignmentsFilter = assignmentIds.length === 0
      ? <header className='bg-white rounded-lg w-75 text-center'>There are no assignments in this course yet</header>
      : <FilteredList items={assignmentIds.map((assignmentId, index) => `Assignment ${index + 1}`)} onItemClick={index => this.onAssignmentSelected(index)} />

    return (
      <ExpandingSection show={this.props.show} >
        <h1 className='card-header rounded'>
          {classcode}
        </h1>
        Api routes to get the names of students and assignments are not done. These are just hardcoded values
        <div className='row'>
          <div className='col-6'>
            <h2> Students </h2>
            {studentFilter}
          </div>
          <div className='col-6'>
            <h2>Assignments </h2>
            {assignmentsFilter}
          </div>
        </div>
      </ExpandingSection>
    )
  }
}

Course.propTypes = {
  match: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired
}

export default Course
