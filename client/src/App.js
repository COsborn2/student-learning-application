import React, { Component } from 'react'
import { BrowserRouter as Browser, Route, Switch } from 'react-router-dom'
import StudentView from './components/students/StudentView'
import Home from './components/Home'
import InstructorView from './components/instructor/InstructorView'
import StudentSignup from './components/login/StudentSignup'
import AuthenticatedRoute from './components/helpers/AuthenticatedRoute'
import InstructorLogin from './components/login/InstructorLogin'
import StudentLoginScreen from './components/login/StudentLoginScreen'
import InstructorSignup from './components/login/InstructorSignup'
import FormExample from './components/login/FormExample'

class App extends Component {
  render () {
    return (
      <Browser>
        <Switch>
          <Route exact path='/' component={Home} />
          <AuthenticatedRoute path='/instructor' component={InstructorView} />
          <AuthenticatedRoute path='/student' component={StudentView} />
          <Route path='/login/instructor' component={FormExample} />
          <Route path='/login/student' component={StudentLoginScreen} />
          <Route path='/signup/instructor' component={InstructorSignup} />
          <Route path='/signup/student' component={StudentSignup} />
        </Switch>
      </Browser>
    )
  }
}

export default App
