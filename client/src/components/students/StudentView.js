import React, { Component } from 'react'
import StudentLogin from './StudentLogin'
import StudentHome from './StudentHome'
import { Redirect, Route, Switch } from 'react-router-dom'
import StudentSpelling from './StudentSpelling'
import StudentWriting from './StudentWriting'

class StudentView extends Component {
  constructor (props) {
    super(props)
    this.state = { userId: '', isAuthenticated: false }
  }

  onAuthenticated (userId) {
    this.setState({ userId: userId, isAuthenticated: true })
    this.props.history.replace('/student/' + userId)
  }

  render () {
    let { isAuthenticated } = this.state
    let { pathname } = this.props.history.location
    if (!isAuthenticated && pathname !== '/student/login') {
      return <Redirect to='/student/login' />
    }
    return (
      <Switch>
        <Route path='/student/login' render={() => <StudentLogin {...this.props} onAuthenticate={(id) => this.onAuthenticated(id)} />} />
        <Route exact path='/student/:id' component={StudentHome} />
        <Route path='/student/:id/spelling' component={StudentSpelling} />
        <Route path='/student/:id/writing' component={StudentWriting} />
      </Switch>
    )
  }
}

export default StudentView
