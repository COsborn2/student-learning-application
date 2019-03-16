import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'
import Course from './Course'
import Button from 'react-bootstrap/Button'
import LoadingScreen from '../loading/LoadingScreen'
import Toolbar from '../menu/Toolbar'
import CreateCourse from './CreateCourse'
import LoadingOverlay from '../loading/LoadingOverlay'
import ExpandingSection from '../helpers/ExpandingSection'

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
      courseSelected: null,
      courseSelectedIndex: -1,
      courseCollapsingIndex: -1,
      isLoading: true,
      isLoadingCourse: false
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
   * This method is called when a user clicks to expand, or collapse a course.
   * If clicked to expand, it fetches the selected course from the api
   * @param newCourseSelected The index of the course the user selected.
   * @returns {Promise<void>} Nothing. It is async to await fetch call
   */
  async onCourseClick (newCourseSelected) {
    let { courseSelectedIndex, courseIds, jwt, courses, courseCollapsingIndex } = this.state
    this.setState({ isLoadingCourse: true })

    courseCollapsingIndex = courseSelectedIndex

    if (newCourseSelected !== courseSelectedIndex) { // if they selected a new course, expand it
      let res = await InstructorApiCalls.getCourseById(jwt, courseIds[newCourseSelected])
      if (res.error) {
        console.log('error: ' + res.error)
      }

      console.log('courseReturned')
      console.log(res)

      const indexOfUpdatedCourse = this.findCourseWithId(courses, res._id)

      if (indexOfUpdatedCourse === -1) { // the course is not in the courses array, add it
        courses.push(res)
      } else { // course found, update it in the courses array
        courses[indexOfUpdatedCourse] = res
      }
      courseSelectedIndex = newCourseSelected // set the selected course index
    } else { // else close the course
      courseSelectedIndex = -1 // reset the selected course index
    }

    this.setState({ isLoadingCourse: false, courses, courseSelectedIndex, courseCollapsingIndex })
  }

  /**
   * This method finds the index of the course that has the id specified
   * @param courses An array of courses to search
   * @param idToFind The id to find in the array of courses
   * @returns {number} The index of the course with id specified, or -1 if not found
   */
  findCourseWithId (courses, idToFind) {
    if (!courses) return -1
    for (let i = 0; i < courses.length; i++) {
      if (courses[i]._id === idToFind) return i
    }
    return -1
  }

  /**
   * This method is called each time this component renders. It constructs the list of
   * Courses that can be expanded. If there are no courses, it is displayed. If a course is not
   * selected, a div is rendered
   * @param courses The courses to render
   * @returns {*} The buttons to expand/collapse the courses, and the currently selected course
   */
  createCourseComponents (courses) {
    if (!courses || courses.length === 0) return <h1 className='rounded-lg w-75 text-center badge-light p-1'>You have no courses yet</h1>
    return (
      <div>
        {
          courses.map((course, index) => {
            const isSelectedCourse = index === this.state.courseSelectedIndex
            const isCollapsingCourse = index === this.state.courseCollapsingIndex
            let courseToRender = <div />

            if (isSelectedCourse || isCollapsingCourse) {
              courseToRender = <Course {...this.props} course={course} />
            }

            return (
              <div key={index}>
                <Button onClick={() => this.onCourseClick(index)}
                  className='test btn-lg btn-primary rounded-pill'>{course.classcode}</Button>
                <ExpandingSection show={isSelectedCourse} onCollapsed={() => this.setState({ courseCollapsingIndex: -1 })}>
                  {courseToRender}
                </ExpandingSection>

                <hr />
              </div>
            )
          }
          )
        }
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
        <LoadingOverlay show={this.state.isLoadingCourse} />
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
