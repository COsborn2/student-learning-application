import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/instructorStyles.css'
import FilteredList from '../helpers/FilteredList'

class Course extends React.PureComponent {
  constructor (props) {
    super(props)
    let course = this.props.course
    this.state = {
      course: course,
      classcode: course.classcode,
      students: course.students,
      assignmentIds: course.assignments,
      show: false
    }
    this.onStudentSelected = this.onStudentSelected.bind(this)
    this.onAssignmentSelected = this.onAssignmentSelected.bind(this)
  }

  /**
   * This is triggered when the user selects a student from the students list
   * @param index The index of the student clicked
   */
  onStudentSelected (index) {
    console.log('student selected: ' + index)
  }

  /**
   * This is triggered when the user selects an assignment from the assignments list
   * @param index The index of the assignment clicked
   */
  onAssignmentSelected (index) {
    console.log('assignment selected: ' + index)
  }

  render () {
    const { students, assignmentIds, classcode } = this.state
    const studentNames = students.map(student => student.username)
    const assignmentNames = assignmentIds.map((assignmentId, index) => `Assignment ${index + 1}`)

    const studentFilter = students.length === 0
      ? <header className='bg-white rounded-lg w-75 text-center'>There are no students in this course yet</header>
      : <FilteredList items={studentNames} onItemClick={index => this.onStudentSelected(index)} />

    const assignmentsFilter = assignmentIds.length === 0
      ? <header className='bg-white rounded-lg w-75 text-center'>There are no assignments in this course yet</header>
      : <FilteredList items={assignmentNames} onItemClick={index => this.onAssignmentSelected(index)} />

    return (
      <div>
        <h1 className='card-header rounded'>
          {classcode}
        </h1>
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
      </div>
    )
  }
}

Course.propTypes = {
  match: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired
}

export default Course
