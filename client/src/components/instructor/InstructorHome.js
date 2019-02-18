import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import Course from './Course'

const courseStyles = {
  collapse: {
    color: 'red',
    transition: 'opacity 1.0s',
    opacity: 0
  },
  expand: {
    transition: 'opacity 1.0s',
    opacity: 1
  }
}

class InstructorHome extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: this.props.match.params.userId,
      courses: this.props.courses,
      selectedCourse: -1,
      courseStyle: courseStyles.expand
    }
    this.onCourseClick = this.onCourseClick.bind(this)
    console.log('path: ' + this.props.match.path)
  }

  onCourseClick (index) {
    let { selectedCourse, courseStyle } = this.state
    console.log('courseClicked: ' + index)
    if (selectedCourse === -1) {
      selectedCourse = index
      courseStyle = courseStyles.collapse
    } else {
      selectedCourse = -1
      courseStyle = courseStyles.expand
    }
    this.setState({ selectedCourse, courseStyle })
  }

  createCourseComponents () {
    const { match, courses } = this.props
    return (
      <React.Fragment>
        {courses.map((course, index) =>
          <React.Fragment key={index}>
            <Link to={{ pathname: `${match.url}/course/${course.classCode}`, state: { course: course } }}
              style={{ textDecoration: 'none' }} onClick={() => this.onCourseClick(index)}
              className='btn-lg btn-primary rounded-pill'>{course.className}</Link>
            <Route styles={this.state.courseStyle} path={`${match.url}/course/${course.classCode}`} component={Course} />
            <hr />
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  render () {
    return (
      <div className='container text-center'>
        <header className='jumbotron my-3 bg-info'>
          <h1 className='display-4 font-weight-bold'> Hello {this.state.userId}</h1>
        </header>
        {this.createCourseComponents()}
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
