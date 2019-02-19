import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import InstructorHome from './InstructorHome'
import InstructorObj from '../../javascript/InstructorObj'

/* The instructor view manages all screens and routes for a specific instructor user
 the login screen creates and authenticates an instructor object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class InstructorView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: new InstructorObj(this.props.history.location.state)
    }
    if (!this.state.user) {
      console.error('InstructorView ctor error: user is null')
    }
  }

  componentDidMount () {
    let user = this.state.user
    if (user && user.isAuth) {
      let succeeded = user.getCourses()
      if (succeeded) { this.setState({ user }) }
    }
  }

  render () {
    let user = this.state.user
    if (!user || !user.isAuth) {
      return <Redirect to='/login/instructor' />
    }
    if (!user.courses) return <div />
    return <Route path='/instructor/:userId' render={(props) => <InstructorHome {...props} courses={user.courses} />} />
  }
}

InstructorView.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default InstructorView
