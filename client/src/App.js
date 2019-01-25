import React, { Component } from 'react'
import { BrowserRouter as Browser, Route } from 'react-router-dom'
import StudentScreen from './components/students/StudentScreen'
import InstructorHome from './components/instructor/InstructorHome'
import StudentSpelling from './components/students/StudentSpelling'
import StudentWriting from './components/students/StudentWriting'
import HeaderBackButton from './components/menu/HeaderBackButton'
import Home from './components/Home'

const HeaderContent = () => (
  <header>
    <Route path='/student' component={HeaderBackButton} />
  </header>
)

const MainContent = () => (
  <main>
    <Route exact path='/' component={Home} />
    <Route exact path='/student' component={StudentScreen} />
    <Route exact path='/instructor' component={InstructorHome} />
    <Route path='/student/spelling' component={StudentSpelling} />
    <Route path='/student/writing' component={StudentWriting} />
  </main>
)

class App extends Component {
  render () {
    return (
      <Browser>
        <div style={{ backgroundColor: '#c0c0c0' }}>
          <HeaderContent />
          <MainContent />
        </div>
      </Browser>
    )
  }
}

export default App
