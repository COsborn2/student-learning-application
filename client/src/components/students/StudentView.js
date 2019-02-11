import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StudentHome from './StudentHome'
import { Redirect, Route, Switch } from 'react-router-dom'
import StudentSpelling from './StudentSpelling'
import StudentWriting from './StudentWriting'
import StudentObj from '../../javascript/StudentObj'

/* The student view manages all screens and routes for a specific student user
 the login screen creates and authenticates a student object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class StudentView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: new StudentObj(this.props.history.location.state)
    }
    if (!this.state.user) {
      console.error('StudentView ctor error: user is null')
    }
  }

  componentDidMount () {
    let user = this.state.user
    if (user && user.isAuth) { // makes sure api isn't called if user is not valid
      let succeeded = user.updateAssignment()
      if (succeeded) { this.setState({ user }) }
    }
  }

  determineSectionToRender () {

  }

  render () {
    let { user } = this.state
    if (!user || !user.isAuth) {
      return <Redirect to='/login/student' />
    }
    return (
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route exact path='/student/:id' component={StudentHome} />
          <Route path='/student/:id/spelling' component={StudentSpelling} />
          <Route path='/student/:id/writing' component={StudentWriting} />
        </Switch>
      </div>
    )
  }
}

StudentView.propTypes = {
  history: PropTypes.object.isRequired
}

export default StudentView
