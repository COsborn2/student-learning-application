import React, { Component } from 'react'
import StudentLogin from './StudentLogin'
import StudentHome from './StudentHome'
import { Route } from 'react-router-dom'
import StudentSpelling from './StudentSpelling'
import StudentWriting from './StudentWriting'

const StudentScreens = () => (
  <div>
    <Route path='/student/home' component={StudentHome} />
    <Route path='/student/spelling' component={StudentSpelling} />
    <Route path='/student/writing' component={StudentWriting} />

  </div>
)

class StudentView extends Component {
  constructor (props) {
    super(props)
    this.state = { isAuthenticated: false }
  }

  render () {
    let { isAuthenticated } = this.state
    if (!isAuthenticated) {
      return <StudentLogin onAuthenticate={() => this.setState({ isAuthenticated: true })} />
    }
    return <StudentScreens />
  }
}

export default StudentView
