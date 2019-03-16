import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/instructorStyles.css'
import ExpandingSection from '../helpers/ExpandingSection'
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

  onStudentSelected (index) {
    console.log('student selected: ' + index)
  }

  onAssignmentSelected (index) {
    console.log('assignment selected: ' + index)
  }

  /**
   * This method forces the state to update of the course is set to show
   * and the course passed by props has changed from the course saved in state
   * @param props Props passed to Course
   * @param state The current state of Course
   * @returns {*} The state items to update
   */
  static getDerivedStateFromProps (props, state) {
    if (!props.show) { // dont update when its not shown
      return { show: false }
    }
    // update if its shown, and its props have changed
    if (props.show && state.course !== props.course) {
      let course = props.course
      console.log('props show, state not')
      return {
        course: course,
        classcode: course.classcode,
        students: course.students,
        assignmentIds: course.assignments,
        show: true
      }
    } else if (!props.show) {
      return { show: false }
    }
    return null
  }

  render () {
    const { students, assignmentIds, classcode, show } = this.state
    const studentNames = students.map(student => student.username)
    const assignmentNames = assignmentIds.map((assignmentId, index) => `Assignment ${index + 1}`)

    const studentFilter = students.length === 0
      ? <header className='bg-white rounded-lg w-75 text-center'>There are no students in this course yet</header>
      : <FilteredList items={studentNames} onItemClick={index => this.onStudentSelected(index)} />

    const assignmentsFilter = assignmentIds.length === 0
      ? <header className='bg-white rounded-lg w-75 text-center'>There are no assignments in this course yet</header>
      : <FilteredList items={assignmentNames} onItemClick={index => this.onAssignmentSelected(index)} />

    return (
      <ExpandingSection show={show} >
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
      </ExpandingSection>
    )
  }
}

Course.propTypes = {
  match: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired
}

export default Course
