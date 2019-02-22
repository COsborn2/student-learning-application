import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StudentHome from './StudentHome'
import { Redirect, Route, Switch } from 'react-router-dom'
import StudentSpelling from './StudentSpelling'
import StudentWriting from './StudentWriting'
import { DragDropContextProvider } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import StudentApiCalls from '../../javascript/StudentApiCalls'

/* The student view manages all screens and routes for a specific student user
 the login screen creates and authenticates a student object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class StudentView extends Component {
  constructor (props) {
    super(props)
    const user = this.props.history.location.state
    this.state = {
      id: user.id,
      jwt: user.jwt,
      api: StudentApiCalls,
      assignments: null,
      progress: null
    }
    this.onWordCompletion = this.onWordCompletion.bind(this)
  }

  componentDidMount () {
    let { api, jwt } = this.state
    if (jwt) { // makes sure api isn't called if user is not valid
      let assignments = api.getAssignments(jwt)
      let progress = api.getProgress(jwt)
      if (assignments && progress) {
        this.setState({ assignments, progress })
      }
    }
  }

  onWordCompletion (wordIndex, allWordsSpelled) {
    let { id, jwt, api, progress } = this.state
    progress.curWordIndex = wordIndex
    if (allWordsSpelled) {
      progress.curWordIndex = 0 // todo this is temporary
      console.log('All words have been spelled. For now the words will repeat')
      this.setState({ progress })
      this.props.history.push(`/student/${id}`)
    }
    api.putAssignments(jwt, progress)
  }

  onLetterCompletion () {
    console.log('all letters have been written')
    this.setState({ curLettersCompleted: true })
  }

  render () {
    const { jwt, assignments, progress } = this.state
    if (!jwt) return <Redirect to='/login/student' />
    if (!assignments || !progress) return <div /> // this is because the component is rendered one time before componentDidMount is called. ie the users assignments will be null
    let wordsToSpell = assignments[progress.curAssignmentIndex].words
    let backend = TouchBackend

    return (
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route exact path='/student/:id' component={StudentHome} />
          <Route path='/student/:id/writing' component={StudentWriting} />
          <Route path='/student/:id/spelling' render={() =>
            <DragDropContextProvider backend={backend}>  { /* this needed to be moved up from StudentSpelling because advancing to the next word would cause multiple HTML5Backend's to be instantiated */ }
              <StudentSpelling wordsToSpell={wordsToSpell} onWordCompletion={(wordIndex, allWordsSpelled) => this.onWordCompletion(wordIndex, allWordsSpelled)} />
            </DragDropContextProvider>} />
        </Switch>
      </div>
    )
  }
}

StudentView.propTypes = {
  history: PropTypes.object.isRequired
}

export default StudentView
