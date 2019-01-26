import React, { Component } from 'react'
import StudentLogin from './StudentLogin'
import StudentHome from './StudentHome'
import { Redirect, Route, Switch } from 'react-router-dom'
import StudentSpelling from './StudentSpelling'
import StudentWriting from './StudentWriting'

class StudentView extends Component {
  constructor (props) {
    super(props)
    this.state = { isAuthenticated: false }
    this.onAuthenticated = this.onAuthenticated.bind(this)
  }

  onAuthenticated () {
    this.setState({ isAuthenticated: true })
    this.props.history.replace('/student/home')
  }

  render () {
    let { isAuthenticated } = this.state
    let { pathname } = this.props.history.location
    if (!isAuthenticated && pathname !== '/student/login') {
      return <Redirect to='/student/login' />
    }
    return (
      <Switch>
        <Route path='/student/login' render={() => <StudentLogin {...this.props} onAuthenticate={this.onAuthenticated} />} />
        <Route path='/student/home' component={StudentHome} />
        <Route path='/student/spelling' component={StudentSpelling} />
        <Route path='/student/writing' component={StudentWriting} />
      </Switch>
    )
  }
}

export default StudentView
