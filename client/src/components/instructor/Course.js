import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/instructorStyles.css'
import FilteredList from '../helpers/FilteredList'
import Button from 'react-bootstrap/Button'
import ExpandingSection from '../helpers/ExpandingSection'

class Course extends React.PureComponent {
  constructor (props) {
    super(props)
    let course = this.props.course
    this.state = {
      course: course,
      classcode: course.classcode,
      students: course.students,
      assignmentIds: course.assignments,
      assignmentsDropdownSelected: false,
      studentsDropdownSelected: false
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
    const { students, assignmentIds, classcode, studentsDropdownSelected, assignmentsDropdownSelected } = this.state
    const studentNames = students.map(student => student.username)
    const assignmentNames = assignmentIds.map((assignmentId, index) => `Assignment ${index + 1}`)

    const studentFilter = students.length === 0
      ? <header className='bg-white rounded-lg w-75 text-center'>There are no students in this course yet</header>
      : <FilteredList items={studentNames} onItemClick={index => this.onStudentSelected(index)} />

    const assignmentsFilter = assignmentIds.length === 0
      ? <header className='bg-white rounded-lg w-75 text-center'>There are no assignments in this course yet</header>
      : <FilteredList items={assignmentNames} onItemClick={index => this.onAssignmentSelected(index)} />

    let studentDropdownArrow = studentsDropdownSelected ? '↑' : '↓'
    let assignmentDropdownArrow = assignmentsDropdownSelected ? '↑' : '↓'

    return (
      <div>
        <h1 className='card-header rounded'>
          {classcode}
        </h1>
        <div className='row p-2 m-2 text-center'>

          <div className='col'>
            <Button className='btn-lg btn-primary rounded-pill m-2' onClick={() => this.setState({ studentsDropdownSelected: !studentsDropdownSelected })}>
            Students {studentDropdownArrow}
            </Button>
            <hr />
            <ExpandingSection show={studentsDropdownSelected}>
              {studentFilter}
            </ExpandingSection>
          </div>
          <div className='col'>
            <Button className='btn-lg btn-primary rounded-pill m-2' onClick={() => this.setState({ assignmentsDropdownSelected: !assignmentsDropdownSelected })}>
            Assignments {assignmentDropdownArrow}
            </Button>
            <hr />
            <ExpandingSection show={assignmentsDropdownSelected}>
              {assignmentsFilter}
            </ExpandingSection>
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
