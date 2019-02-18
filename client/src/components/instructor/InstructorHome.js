import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import Course from './Course'

function createCourses (match, courses) {
  return (
    <React.Fragment>
      {courses.map((course, index) =>
        <React.Fragment key={index}>
          <Link to={{ pathname: `${match.url}/course/${course.classCode}`, state: { course: course } }}
            style={{ textDecoration: 'none' }} className='btn-lg btn-primary rounded-pill'>{course.className}</Link>
          <Route path={`${match.url}/course/${course.classCode}`} component={Course} />
          <hr />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

class InstructorHome extends Component {
  constructor (props) {
    super(props)
    this.state = {
      courses: this.props.courses,
      selected: -1
    }
  }

  render () {
    let { courses } = this.state
    let match = this.props.match
    return (
      <div className='container text-center'>
        <header className='jumbotron my-3 bg-info'>
          <h1 className='display-4 font-weight-bold'> Hello {match.params.userId}</h1>
        </header>
        {createCourses(match, courses)}
      </div>
    )
  }
}

InstructorHome.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired
}

export default InstructorHome
