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
    this.state = {
      id: this.props.id,
      jwt: this.props.jwt,
      assignments: null,
      progress: null,
      isLoadAnimComplete: false
    }
    this._isLoading = true
    this.onWordCompletion = this.onWordCompletion.bind(this)
    this.onLoadingAnimComplete = this.onLoadingAnimComplete.bind(this)
  }

  async componentDidMount () {
    let { jwt } = this.state
    // const res = await StudentApiCalls.getAssignmentsAndProgress(jwt)
    // const student = res.student
    //    let progress = {
    //      currentAssignment: student.currentAssignment,
    //      currentLetter: student.currentLetter,
    //      currentWord: student.currentWord,
    //      finishedCourse: student.finishedCourse
    //    }
    //    const classroom = res.classroom
    //    console.log(student)
    //    console.log(classroom)

    let assignments = StudentApiCalls.getAssignments(jwt)
    let progress = StudentApiCalls.getProgress(jwt)
    if (assignments && progress) {
      setTimeout(() => {
        this._isLoading = false
        this.setState({ assignments, progress })
      }, 1000)
    }
    setTimeout(() => {
      this._isLoading = false
      this.setState({ assignments: [] })
    }, 1000)
  }

  onLoadingAnimComplete () {
    this.setState({ isLoadAnimComplete: true })
    this.props.history.replace(`/student/${this.state.id}`) // todo remove this. Handle redirection in authenticatedRoute
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
          <Route exact path='/student/:id' render={(props) => <StudentHome {...props} assignments={assignments} progress={progress} />} />
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
  id: PropTypes.string.isRequired,
  jwt: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default StudentView
