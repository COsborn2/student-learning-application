import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StudentHome from './StudentHome'
import { Redirect, Route, Switch } from 'react-router-dom'
import StudentSpelling from './StudentSpelling'
import StudentWriting from './StudentWriting'
import StudentObj from '../../javascript/StudentObj'

/* The student view manages all screens and routes for a specific student user
 the login screen creates and authenticates a student object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class StudentView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: new StudentObj(this.props.history.location.state),
      curAssignmentIndex: 0,
      curWordsCompleted: false
    }
    this.onSpellingCompletion = this.onSpellingCompletion.bind(this)
    this._isMounted = false
    if (!this.state.user) {
      console.error('StudentView ctor error: user is null')
    }
  }

  componentDidMount () {
    let user = this.state.user
    if (user && user.isAuth) { // makes sure api isn't called if user is not valid
      let succeeded = user.updateAssignment()
      if (succeeded) {
        this.setState({ user })
        this._isMounted = true
      }
    }
  }

  componentWillUnmount () { this._isMounted = false }

  onSpellingCompletion () {
    console.log('all words have been spelled')
    this.setState({ curWordsCompleted: true })
    this.props.history.push('/student/' + this.state.user.id)
  }

  onLetterCompletion () {
    console.log('all letters have been written')
    this.setState({ curLettersCompleted: true })
  }

  render () {
    let { user, curAssignmentIndex } = this.state
    if (!user || !user.isAuth) {
      return <Redirect to='/login/student' />
    }
    if (!this._isMounted) return <div /> // this is because the component is rendered one time before componentDidMount is called. ie the users assignments will be null

    let wordsToSpell = user.assignments[curAssignmentIndex].words
    return (
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route exact path='/student/:id' component={StudentHome} />
          <Route path='/student/:id/spelling' render={() => <StudentSpelling wordsToSpell={wordsToSpell} onSpellingCompletion={this.onSpellingCompletion} />} />
          <Route path='/student/:id/writing' component={StudentWriting} />
        </Switch>
      </div>
    )
  }
}

StudentView.propTypes = {
  history: PropTypes.object.isRequired
}

export default StudentView
