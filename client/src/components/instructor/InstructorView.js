import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'
import Course from './Course'
import Button from 'react-bootstrap/Button'
import '../helpers/HelperStyles.css'
import LoadingSpinner from '../helpers/LoadingSpinner'

/* The instructor view manages all screens and routes for a specific instructor user
 the login screen creates and authenticates an instructor object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class InstructorView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.user.name,
      jwt: this.props.user.jwt,
      courses: null,
      selectedCourse: -1,
      isLoadComplete: false
    }
    this._isLoading = true
    this.onCourseClick = this.onCourseClick.bind(this)
    this.onLoadingComplete = this.onLoadingComplete.bind(this)
  }

  componentDidMount () {
    let { jwt } = this.state
    let courses = InstructorApiCalls.getCourses(jwt)
    if (courses) {
      setTimeout(() => {
        this._isLoading = false
        this.setState({ courses })
      }, 1000)
    }
  }

  onCourseClick (index) {
    let { selectedCourse } = this.state
    selectedCourse = index === selectedCourse ? -1 : index
    this.setState({ selectedCourse })
    console.log('courseClicked: ' + selectedCourse)
  }

  onLoadingComplete () {
    this.setState({ isLoadComplete: true })
    this.props.history.replace(`/instructor/${this.state.name}`) // todo remove this. Handle redirection in authenticatedRoute
  }

  createCourseComponents (courses) {
    return (
      <div>
        {courses.map((course, index) =>
          <div key={index}>
            <Button onClick={() => this.onCourseClick(index)}
              className='test btn-lg btn-primary rounded-pill'>{course.className}</Button>
            <Course {...this.props} show={index === this.state.selectedCourse} course={course} />
            <hr />
          </div>
        )}
      </div>
    )
  }

  render () {
    let { courses, name, isLoadComplete } = this.state
    if (!isLoadComplete) return <LoadingSpinner isLoading={this._isLoading} onLoadComplete={this.onLoadingComplete} />
    return (
      <div className='container text-center'>
        <header className='jumbotron my-3 bg-info'>
          <h1 className='display-4 font-weight-bold'> Hello {name}</h1>
        </header>
        {this.createCourseComponents(courses)}
      </div>
    )
  }
}

InstructorView.propTypes = {
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default InstructorView
