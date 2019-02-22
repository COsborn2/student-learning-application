import React, { Component } from 'react'
import { BrowserRouter as Browser, Route, Switch } from 'react-router-dom'
import StudentView from './components/students/StudentView'
import Home from './components/Home'
import InstructorView from './components/instructor/InstructorView'
import SignupScreen from './components/login/SignupScreen'
import LoginScreen from './components/login/LoginScreen'
import AuthenticatedRoute from './components/helpers/AuthenticatedRoute'

class App extends Component {
  render () {
    return (
      <Browser>
        <Switch>
          <Route exact path='/' component={Home} />
          <AuthenticatedRoute path='/instructor' component={InstructorView} />
          <AuthenticatedRoute path='/student' component={StudentView} />
          <Route path='/signup/:type' component={SignupScreen} />
          <Route path='/login/:type' component={LoginScreen} />
        </Switch>
      </Browser>
    )
  }
}

export default App
