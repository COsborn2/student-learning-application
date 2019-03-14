import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'
import Course from './Course'
import Button from 'react-bootstrap/Button'
import LoadingScreen from '../loading/LoadingScreen'
import Toolbar from '../menu/Toolbar'
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
      courses: null,
      jwt: this.props.user.jwt,
      courseIndex: -1,
      isLoading: true
    }
    this._triggerAnimFade = false
    this._isMounted = true
    this.onCourseClick = this.onCourseClick.bind(this)
    this.onLoadingAnimationStop = this.onLoadingAnimationStop.bind(this)
    this.createCourse = this.createCourse.bind(this)
  }

  /***
   * This method is called when the component is mounted to the DOM.
   * It loads the instructors courses
   */
  async componentDidMount () {
    let { jwt } = this.state
    let res = await InstructorApiCalls.getCourses(jwt)

    if (res.error) {
      this.props.history.push('/error', res.error)
    }

    const courses = res.courses

    if (courses && this._isMounted) {
      this._triggerAnimFade = true
      this.setState({ courses })
    } else {
      this.props.history.push('/error', `Error retrieving course from api: ${res.error}`)
    }
  }

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
   * @param courseIndexSelected The index of the course the user selected.
   * @returns {Promise<void>} Nothing. It is async to await fetch call
   */
  onCourseClick (courseIndexSelected) {
    let { courseIndex } = this.state
    if (courseIndexSelected !== courseIndex) { // if they selected a new course, expand it
      courseIndex = courseIndexSelected
    } else { // else close the course
      courseIndex = -1
    }

    this.setState({ courseIndex })
  }

  /**
   * This method is called each time this component renders. It constructs the list of
   * Courses that can be expanded. If there are no courses, it is displayed
   * @param courses
   * @returns {*}
   */
  createCourseComponents (courses) {
    if (!courses || courses.length === 0) return <p className='badge-light'>You have no courses yet</p>
    return (
      <div>
        {courses.map((course, index) =>
          <div key={index}>
            <Button onClick={() => this.onCourseClick(index)}
              className='test btn-lg btn-primary rounded-pill'>{course.classcode}</Button>
            <Course {...this.props} show={index === this.state.courseIndex} course={course} />
            <hr />
          </div>
        )}
      </div>
    )
  }

  /**
   * This method gets called everytime a new course is being created. If it was created successfully, the courseIds are updated
   * @param courseCode Course code of the course to create
   * @returns {Promise<*>} The course created, or error returned from api
   */
  async createCourse (courseCode) {
    const res = await InstructorApiCalls.createCourse(this.state.jwt, courseCode)

    if (!res.error && res.courseIds) {
      let courses = this.state.courses
      courses.push(res.course)
      this.setState({ courseIds: res.courseIds, courses })
    }
    return res
  }

  render () {
    let { name, courses, isLoading } = this.state
    if (isLoading) return <LoadingScreen triggerFadeAway={this._triggerAnimFade} onStopped={this.onLoadingAnimationStop} />
    return (
      <div>
        <Toolbar />
        <div className='container'>
          <header className='jumbotron my-3 bg-info text-center'>
            <h1 className='display-4 font-weight-bold'> Hello {name}</h1>
          </header>
          <CreateCourse createCourse={(courseCode) => this.createCourse(courseCode)} />
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
