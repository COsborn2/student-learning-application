import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'
import Course from './Course'
import Button from 'react-bootstrap/Button'

/* The instructor view manages all screens and routes for a specific instructor user
 the login screen creates and authenticates an instructor object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class InstructorView extends Component {
  constructor (props) {
    super(props)
    const user = this.props.history.location.state
    this.state = {
      id: user.id,
      jwt: user.jwt,
      api: InstructorApiCalls,
      courses: null,
      selectedCourse: -1
    }
    this.onCourseClick = this.onCourseClick.bind(this)
  }

  onCourseClick (index) {
    let { selectedCourse } = this.state
    selectedCourse = index === selectedCourse ? -1 : index
    this.setState({ selectedCourse })
    console.log('instructorView courseClicked: ' + selectedCourse)
  }

  createCourseComponents () {
    return (
      <div>
        {this.state.courses.map((course, index) =>
          <div key={index}>
            <Button onClick={() => this.onCourseClick(index)} className='test btn-lg btn-primary rounded-pill'>{course.className}</Button>
            <Course {...this.props} show={index === this.state.selectedCourse} course={course} />
            <hr />
          </div>
        )}
      </div>
    )
  }

  componentDidMount () {
    let { api, jwt } = this.state
    if (jwt) { // makes sure api isn't called if user is not valid
      let courses = api.getCourses(jwt)
      if (courses) {
        this.setState({ courses })
      }
    }
  }

  render () {
    let { jwt, courses, id } = this.state
    if (!jwt) return <Redirect to='/login/instructor' />
    if (!courses) return <div />
    return (
      <div className='container text-center'>
        <header className='jumbotron my-3 bg-info'>
          <h1 className='display-4 font-weight-bold'> Hello {id}</h1>
        </header>
        {this.createCourseComponents()}
      </div>
    )
  }
}

InstructorView.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default InstructorView
