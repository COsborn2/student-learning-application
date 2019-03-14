import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'
import Course from './Course'
import Button from 'react-bootstrap/Button'
import LoadingScreen from '../loading/LoadingScreen'
import Toolbar from '../menu/Toolbar'
import { Route, Switch } from 'react-router-dom'
import CreateCourse from './CreateCourse'

/* The instructor view manages all screens and routes for a specific instructor user
 the login screen creates and authenticates an instructor object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class InstructorView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.user.name,
      courseIds: this.props.user.courseIds,
      jwt: this.props.user.jwt,
      courses: null,
      courseIndex: -1,
      isLoading: true
    }
    this._triggerAnimFade = true
    this._isMounted = true
    this.onCourseClick = this.onCourseClick.bind(this)
    this.onLoadingAnimationStop = this.onLoadingAnimationStop.bind(this)
    this.onCourseCreated = this.onCourseCreated.bind(this)
  }

  /***
   * This method is called when the component is mounted to the DOM.
   */
  componentDidMount () { }

  /**
   * This method is called when the component is unmounted
   */
  componentWillUnmount () {
    this._isMounted = false
  }

  /**
   * This is triggered when the loading animation is completely faded away
   */
  onLoadingAnimationStop () {
    if (this._isMounted) {
      this._triggerAnimFade = false
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
      let res = await InstructorApiCalls.getCourseById(courseIds[index])
      if (res.error) {
        const errMsg = `Error retrieving course from api: ${res.error}`
        console.error('Error retrieving ')
        this.props.history.push('/error', errMsg)
        return
      }
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

  onCourseCreated (updatedCourseIds) {
    this.setState({ courseIds: updatedCourseIds })
  }

  render () {
    let { courses, name, jwt, courseIds, isLoading } = this.state
    if (isLoading) return <LoadingScreen triggerFadeAway={this._triggerAnimFade} onStopped={this.onLoadingAnimationStop} />
    console.log(courseIds)
    return (
      <div>
        <Toolbar />
        <div className='container'>
          <header className='jumbotron my-3 bg-info text-center'>
            <h1 className='display-4 font-weight-bold'> Hello {name}</h1>
          </header>
          <CreateCourse jwt={jwt} onCourseCreated={(updatedCourseIds) => this.onCourseCreated(updatedCourseIds)} />
          <div className='container-fluid'>
            {this.createCourseComponents(courses)}
          </div>
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
