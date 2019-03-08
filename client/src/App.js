import React, { Component } from 'react'
import { BrowserRouter as Browser, Route, Switch } from 'react-router-dom'
import StudentView from './components/students/StudentView'
import Home from './components/Home'
import InstructorView from './components/instructor/InstructorView'
import AuthenticatedRoute from './components/helpers/AuthenticatedRoute'
import InstructorLogin from './components/login/InstructorLogin'
import StudentSignup from './components/login/StudentSignup'
import StudentLogin from './components/login/StudentLogin'
import InstructorSignup from './components/login/InstructorSignup'
//import LandScape from './components/helpers/LandScape' to up keep standard

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0, isLandScape: true};
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight, isLandScape: this.checkLandScape()});
  }

  checkLandScape() {
    return this.state.height > this.state.width
  }
  //<LandScape isLandScape = {this.state.isLandScape} /> Dont know where to put this
  render () {
    return (
      <Browser>
        <Switch>
          <Route exact path='/' component={Home} />
          <AuthenticatedRoute path='/instructor' component={InstructorView} />
          <AuthenticatedRoute path='/student' component={StudentView} />
          <Route path='/login/instructor' component={InstructorLogin} />
          <Route path='/login/student' component={StudentLogin} />
          <Route path='/signup/instructor' component={InstructorSignup} />
          <Route path='/signup/student' component={StudentSignup} />
        </Switch>
      </Browser>
    )
  }
}

export default App
