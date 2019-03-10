import React, { Component, Suspense, lazy } from 'react'
import { BrowserRouter as Browser, Route, Switch } from 'react-router-dom'
import AuthenticatedRoute from './components/helpers/AuthenticatedRoute'
import LoadingGif from './assets/images/LoadingScreenGif.gif'
import './assets/css/LoadingStyles.css'

const Home = lazy(() => import('./components/Home'))
const StudentLogin = lazy(() => import('./components/login/StudentLogin'))
const StudentView = lazy(() => import('./components/students/StudentView'))
const InstructorView = lazy(() => import('./components/instructor/InstructorView'))
const InstructorLogin = lazy(() => import('./components/login/InstructorLogin'))
const StudentSignup = lazy(() => import('./components/login/StudentSignup'))
const InstructorSignup = lazy(() => import('./components/login/InstructorSignup'))
const ErrorScreen = lazy(() => import('./components/helpers/ErrorScreen'))
const centerStyle = { top: 0, bottom: 0, left: 0, right: 0 }

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { width: 0, height: 0, isLandScape: true }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount () {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions () {
    this.setState({ width: window.innerWidth, height: window.innerHeight, isLandScape: this.checkLandScape() })
  }

  checkLandScape () {
    return this.state.height > this.state.width
  }
  // <LandScape isLandScape = {this.state.isLandScape} /> Dont know where to put this
  render () {
    return (
      <Browser>
        <Suspense fallback={<img src={LoadingGif} alt='Loading...' className='img-fluid position-absolute m-auto fade-in' style={centerStyle} />}>
          <Switch>
            <Route exact path='/' render={(props) => <Home {...props} />} />
            <AuthenticatedRoute path='/instructor' lazyComponent={InstructorView} />
            <AuthenticatedRoute path='/student' lazyComponent={StudentView} />
            <Route path='/login/instructor' render={(props) => <InstructorLogin {...props} />} />
            <Route path='/login/student' render={(props) => <StudentLogin {...props} />} />
            <Route path='/signup/instructor' render={(props) => <InstructorSignup {...props} />} />
            <Route path='/signup/student' render={(props) => <StudentSignup {...props} />} />
            <Route path='/error' render={(props) => <ErrorScreen {...props} />} />
          </Switch>
        </Suspense>
      </Browser>
    )
  }
}

export default App
