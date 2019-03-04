import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StudentHome from './StudentHome'
import { Route, Switch } from 'react-router-dom'
import StudentSpelling from './StudentSpelling'
import StudentWriting from './StudentWriting'
import StudentVideo from './StudentVideo'
import { DragDropContextProvider } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import StudentApiCalls from '../../javascript/StudentApiCalls'
import LoadingSpinner from '../helpers/LoadingSpinner'

/* The student view manages all screens and routes for a specific student user
 the login screen creates and authenticates a student object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class StudentView extends Component {
  constructor (props) {
    super(props)
    const id = this.props.match.params.id
    this.state = {
      id: id,
      jwt: this.props.jwt,
      api: StudentApiCalls,
      assignments: null,
      progress: null,
      isLoadAnimComplete: false
    }
    this._isLoading = true
    this.onWordCompletion = this.onWordCompletion.bind(this)
    this.onLoadingAnimComplete = this.onLoadingAnimComplete.bind(this)
  }

  componentDidMount () {
    let { api, jwt } = this.state
    let assignments = api.getAssignments(jwt)
    let progress = api.getProgress(jwt)
    if (assignments && progress) {
      setTimeout(() => {
        this._isLoading = false
        this.setState({ assignments, progress })
      }, 2000)
    }
  }

  onLoadingAnimComplete () {
    this.setState({ isLoadAnimComplete: true })
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
    const { assignments, progress, isLoadAnimComplete } = this.state
    if (!isLoadAnimComplete) return <LoadingSpinner isLoading={this._isLoading} onLoadingAnimComplete={this.onLoadingAnimComplete} />
    let wordsToSpell = assignments[progress.curAssignmentIndex].words

    return (
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route exact path='/student/:id' component={StudentHome} />
          <Route path='/student/:id/writing' component={StudentWriting} />
          <Route path='/student/:id/spelling' render={() =>
            <DragDropContextProvider
              backend={TouchBackend}>  { /* this needed to be moved up from StudentSpelling because advancing to the next word would cause multiple HTML5Backend's to be instantiated */}
              <StudentSpelling wordsToSpell={wordsToSpell}
                onWordCompletion={(wordIndex, allWordsSpelled) => this.onWordCompletion(wordIndex, allWordsSpelled)} />
            </DragDropContextProvider>} />
          <Route path='/student/:id/video' component={StudentVideo} />
        </Switch>
      </div>
    )
  }
}

StudentView.propTypes = {
  jwt: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default StudentView
