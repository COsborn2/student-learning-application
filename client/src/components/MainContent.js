import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HomeScreen from './HomeScreen'
import StudentSpelling from './StudentSpelling'
import StudentWriting from './StudentWriting'
import StudentHomeScreen from './StudentHomeScreen'

const MainContent = () => (
  <main>
    <Switch>
      <Route exact path='/' component={HomeScreen} />
      <Route exact path='/student' component={StudentHomeScreen} />
      <Route path='/student/spelling' component={StudentSpelling} />
      <Route path='/student/writing' component={StudentWriting} />
    </Switch>
  </main>
)

export default MainContent
