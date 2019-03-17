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
import AssignmentInfo from './AssignmentInfo'

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
      showAssignmentIndex: -1,
      showAssignment: false,
      isLoading: false
    }
    this.onStudentSelected = this.onStudentSelected.bind(this)
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
  async onAssignmentSelected (index) {
    const { assignments } = this.state

    this.setState({ isLoading: true })
    assignments[index] = await InstructorApiCalls.getAssignmentById(assignments[index]._id)
    this.setState({ isLoading: false })

    this.setState({ showAssignmentIndex: index, showAssignment: true, assignmentsDropdownSelected: false, assignments })
  }

  async onDeleteCourse () {
    const shouldDelete = window.confirm(`Are you sure you want to delete ${this.props.course.classcode}?
All of the students will be deleted as well. This action cannot be undone`)

    if (shouldDelete) {
      await this.props.onDeleteCourse(this.props.course._id)
    }
  }

  render () {
    const { students, assignments, isLoading,
      classcode, studentsDropdownSelected, assignmentsDropdownSelected,
      showStudentIndex, showStudent, showAssignmentIndex, showAssignment } = this.state

    console.log(students)

    const studentFilter = students.length === 0
      ? <h3>There are no students in this course yet</h3>
      : <FilteredList items={students.map(student => student.username)} onItemClick={index => this.onStudentSelected(index)} />

    const assignmentsFilter = assignments.length === 0
      ? <h3>There are no assignments in this course yet</h3>
      : <FilteredList items={assignments.map((assignment) => assignment.name)} onItemClick={index => this.onAssignmentSelected(index)} />

    const studentToShow = showStudentIndex !== -1 ? <StudentInfo onCloseStudent={() => this.setState({ showStudent: false })} onDeleteStudent={(id) => this.props.onDeleteStudent(id)} student={students[showStudentIndex]} assignments={assignments} /> : <div />
    const assignmentToShow = showAssignmentIndex !== -1 ? <AssignmentInfo onCloseAssignment={() => this.setState({ showAssignment: false })} assignment={assignments[showAssignmentIndex]} /> : <div />
    const studentDropdownArrow = studentsDropdownSelected ? '↑' : '↓'
    const assignmentDropdownArrow = assignmentsDropdownSelected ? '↑' : '↓'

    return (
      <div>
        <LoadingOverlay show={isLoading} />
        <div className='row card-header rounded '>
          <h1>{classcode}</h1>
          <div className='flex-fill' />
          <Button className='badge-danger mr-2 fa' onClick={() => this.onDeleteCourse()}>&#xf014;</Button>
        </div>
        <div className='row p-2 m-2'>

          <div className='col text-center'>
            <Button className='btn-lg btn-primary rounded-pill m-2'
              onClick={() => this.setState({ studentsDropdownSelected: !studentsDropdownSelected })}>
            Students {studentDropdownArrow}
            </Button>
            <hr />
            <ExpandingSection show={studentsDropdownSelected}>
              {studentFilter}
            </ExpandingSection>
            <HorizontalExpandingSection className='badge-secondary' show={showStudent}
              onCollapsed={() => this.setState({ showStudentIndex: -1, studentsDropdownSelected: true })}>
              {studentToShow}
            </HorizontalExpandingSection>

          </div>

          <div className='col-1'>
            <p style={{ borderLeft: '4px solid #4085bd', height: '100%', position: 'absolute', left: '50%', marginLeft: '-2px' }} />
          </div>

          <div className='col text-center'>
            <Button className='btn-lg btn-primary rounded-pill m-2'
              onClick={() => this.setState({ assignmentsDropdownSelected: !assignmentsDropdownSelected })}>
            Assignments {assignmentDropdownArrow}
            </Button>
            <hr />
            <ExpandingSection show={assignmentsDropdownSelected}>
              {assignmentsFilter}
            </ExpandingSection>
            <HorizontalExpandingSection className='badge-secondary' show={showAssignment}
              onCollapsed={() => this.setState({ showAssignmentIndex: -1, assignmentsDropdownSelected: true })}>
              {assignmentToShow}
            </HorizontalExpandingSection>
          </div>
        </div>
      </div>
    )
  }
}

Course.propTypes = {
  match: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  onDeleteStudent: PropTypes.func.isRequired,
  onDeleteCourse: PropTypes.func.isRequired
}

export default Course
