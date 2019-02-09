import React, { Component } from 'react'
import { BrowserRouter as Browser, Route, Switch } from 'react-router-dom'
import StudentView from './components/students/StudentView'
import Home from './components/Home'
import InstructorView from './components/instructor/InstructorView'
import SignupModal from './components/login/SignupModal'

class App extends Component {
  render () {
    return (
      <Browser>
        <Switch style={{ borderRadius: 50, backgroundColor: '#c0c0c0' }}>
          <Route exact path='/' component={Home} />
          <Route path='/instructor' component={InstructorView} />
          <Route path='/student' component={StudentView} />
          <Route path='/signup/:type' component={SignupModal} />
        </Switch>
      </Browser>
    )
  }
}

export default App
