import React, { Component } from 'react'
import LoginModal from '../login/LoginModal'
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
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route path='/student/login' render={() => <LoginModal {...this.props} userType='Student' onAuthenticate={(id) => this.onAuthenticated(id)} />} />
          <Route exact path='/student/:id' component={StudentHome} />
          <Route path='/student/:id/spelling' component={StudentSpelling} />
          <Route path='/student/:id/writing' component={StudentWriting} />
        </Switch>
      </div>
    )
  }
}

export default StudentView
