import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/instructorStyles.css'
import FilteredList from '../helpers/FilteredList'
import Button from 'react-bootstrap/Button'
import ExpandingSection from '../helpers/ExpandingSection'
import StudentInfo from './StudentInfo'
import HorizontalExpandingSection from '../helpers/HorizontalExpandingSection'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'
import LoadingOverlay from '../loading/LoadingOverlay'

class Course extends React.PureComponent {
  constructor (props) {
    super(props)
    let course = this.props.course
    this.state = {
      course: course,
      classcode: course.classcode,
      students: course.students,
      assignments: course.assignments,
      assignmentsDropdownSelected: false,
      studentsDropdownSelected: false,
      showStudentIndex: -1,
      showStudent: false,
      isLoading: false
    }
    this.onStudentSelected = this.onStudentSelected.bind(this)
    this.onCloseStudent = this.onCloseStudent.bind(this)
    this.onAssignmentSelected = this.onAssignmentSelected.bind(this)
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

  /**
   * This is triggered when the user selects a student from the students list
   * @param index The index of the student clicked
   */
  async onStudentSelected (index) {
    const { students, assignments } = this.state
    const currentAssignmentIndex = students[this.clampValue(index, assignments.length)].currentAssignment

    this.setState({ isLoading: true })
    assignments[currentAssignmentIndex] = await InstructorApiCalls.getAssignmentById(assignments[currentAssignmentIndex]._id)
    this.setState({ isLoading: false })

    this.setState({ showStudentIndex: index, showStudent: true, studentsDropdownSelected: false, assignments })
  }

  /**
   * This is triggered when the user selects an assignment from the assignments list
   * @param index The index of the assignment clicked
   */
  onAssignmentSelected (index) {
    console.log('assignment selected: ' + index)
  }

  onCloseStudent () {
    this.setState({ showStudentIndex: -1, studentsDropdownSelected: true })
  }

  render () {
    const { students, assignments, isLoading, classcode, studentsDropdownSelected, assignmentsDropdownSelected, showStudentIndex, showStudent } = this.state

    const studentFilter = students.length === 0
      ? <h3>There are no students in this course yet</h3>
      : <FilteredList items={students.map(student => student.username)} onItemClick={index => this.onStudentSelected(index)} />

    const assignmentsFilter = assignments.length === 0
      ? <h3>There are no assignments in this course yet</h3>
      : <FilteredList items={assignments.map((assignment) => assignment.name)} onItemClick={index => this.onAssignmentSelected(index)} />

    const studentToShow = showStudentIndex !== -1 ? <StudentInfo onCloseStudent={() => this.setState({ showStudent: false })} student={students[showStudentIndex]} assignments={assignments} /> : <div />
    const studentDropdownArrow = studentsDropdownSelected ? '↑' : '↓'
    const assignmentDropdownArrow = assignmentsDropdownSelected ? '↑' : '↓'

    return (
      <div>
        <LoadingOverlay show={isLoading} />
        <h1 className='card-header rounded'>
          {classcode}
        </h1>
        <div className='row p-2 m-2'>

          <div className='col text-center'>
            <Button className='btn-lg btn-primary rounded-pill m-2' onClick={() => this.setState({ studentsDropdownSelected: !studentsDropdownSelected })}>
            Students {studentDropdownArrow}
            </Button>
            <hr />
            <ExpandingSection show={studentsDropdownSelected}>
              {studentFilter}
            </ExpandingSection>
            <HorizontalExpandingSection className='badge-secondary' show={showStudent} onCollapsed={() => this.setState({ showStudentIndex: -1, studentsDropdownSelected: true })}>
              {studentToShow}
            </HorizontalExpandingSection>

          </div>
          <div className='col text-center'>
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
