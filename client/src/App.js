import React, { Component, Suspense, lazy } from 'react'
import { BrowserRouter as Browser, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import AuthenticatedRoute from './components/helpers/AuthenticatedRoute'
import LoadingScreenGif from './components/loading/LoadingScreenGif'

const StudentLogin = lazy(() => import('./components/login/StudentLogin'))
const StudentView = lazy(() => import('./components/students/StudentView'))
const InstructorView = lazy(() => import('./components/instructor/InstructorView'))
const InstructorLogin = lazy(() => import('./components/login/InstructorLogin'))
const StudentSignup = lazy(() => import('./components/login/StudentSignup'))
const InstructorSignup = lazy(() => import('./components/login/InstructorSignup'))

class App extends Component {
  render () {
    return (
      <Browser>
        <Suspense fallback={<LoadingScreenGif />}>
          <Switch>
            <Route exact path='/' component={Home} />
            <AuthenticatedRoute path='/instructor' lazyComponent={InstructorView} />
            <AuthenticatedRoute path='/student' lazyComponent={StudentView} />
            <Route path='/login/instructor' render={(props) => <InstructorLogin {...props} />} />
            <Route path='/login/student' render={(props) => <StudentLogin {...props} />} />
            <Route path='/signup/instructor' render={(props) => <InstructorSignup {...props} />} />
            <Route path='/signup/student' render={(props) => <StudentSignup {...props} />} />
          </Switch>
        </Suspense>
      </Browser>
    )
  }
}

export default App
