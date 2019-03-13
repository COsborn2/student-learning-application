import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'
import Course from './Course'
import Button from 'react-bootstrap/Button'
import LoadingScreen from '../loading/LoadingScreen'
import Toolbar from '../menu/Toolbar'

/* The instructor view manages all screens and routes for a specific instructor user
 the login screen creates and authenticates an instructor object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class InstructorView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.user.name,
      courseIds: this.props.courses,
      jwt: this.props.user.jwt,
      courses: null,
      courseIndex: -1,
      isLoading: true
    }
    this._triggerAnimFade = false
    this._isMounted = true
    this.onCourseClick = this.onCourseClick.bind(this)
    this.onLoadingAnimationStop = this.onLoadingAnimationStop.bind(this)
  }

  /***
   * This method is called when the component is mounted to the DOM.
   */
  componentDidMount () {
    this._triggerAnimFade = true
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  onLoadingAnimationStop () {
    if (this._isMounted) {
      this.setState({ isLoading: false })
      this.props.history.replace(`/instructor/${this.state.name}`)
    }
  }

  /**
   * This method is called when a user clicks to expand a course.
   * It fetches the selected course from the api
   * @param index The index of the course to select.
   * @returns {Promise<void>} Nothing. It is async to await fetch call
   */
  async onCourseClick (index) {
    let { courseIndex, course, courseIds } = this.state
    if (index === courseIndex) { // if they selected a new course, load it from the api
      courseIndex = index
      course = await InstructorApiCalls.getCourseById(courseIds[index])
    } else { // else close the course
      courseIndex = -1
    }

    this.setState({ courseIndex, course })
    console.log('courseClicked: ' + courseIndex)
  }

  /**
   * This method is called each time this component renders. It constructs the list of
   * Courses that can be expanded. If there are no courses, it is displayed
   * @param courses
   * @returns {*}
   */
  createCourseComponents (courses) {
    if (!courses) return null
    return (
      <div>
        {courses.map((course, index) =>
          <div key={index}>
            <Button onClick={() => this.onCourseClick(index)}
              className='test btn-lg btn-primary rounded-pill'>{course.className}</Button>
            <Course {...this.props} show={index === this.state.courseIndex} course={course} />
            <hr />
          </div>
        )}
      </div>
    )
  }

  render () {
    let { courses, name, courseIds, isLoading } = this.state
    if (isLoading) return <LoadingScreen triggerFadeAway={this._triggerAnimFade} onStopped={this.onLoadingAnimationStop} />
    console.log(courseIds)
    return (
      <div>
        <Toolbar />
        <div className='container text-center'>
          <header className='jumbotron my-3 bg-info'>
            <h1 className='display-4 font-weight-bold'> Hello {name}</h1>
          </header>
          {this.createCourseComponents(courses)}
        </div>
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
