import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import InstructorHome from './InstructorHome'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'

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
      courses: null
    }
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
    let { jwt, courses } = this.state
    if (!jwt) return <Redirect to='/login/instructor' />
    if (!courses) return <div />
    return <Route path='/instructor/:userId' render={(props) => <InstructorHome {...props} courses={courses} />} />
  }
}

InstructorView.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default InstructorView
