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
      username: this.props.user.username,
      jwt: this.props.user.jwt,
      classCode: null,
      assignments: null,
      currentAssignment: null,
      progress: null,
      isLoadComplete: false
    }
    this._isLoading = true
    this.onWordCompletion = this.onWordCompletion.bind(this)
    this.onLoadingComplete = this.onLoadingComplete.bind(this)
  }

  async componentDidMount () {
    let { jwt } = this.state
    const res = await StudentApiCalls.getAssignmentsAndProgress(jwt)
    const student = res.student
    const progress = {
      currentAssignmentIndex: 0, // student.currentAssignment, todo remove mock
      currentLetterIndex: student.currentLetter,
      currentWordIndex: student.currentWord,
      finishedCourse: student.finishedCourse
    }
    const classroom = res.classroom
    const classCode = classroom.classcode
    const classAssignments = classroom.assignments
    const currentAssignment = await StudentApiCalls.getAssignmentById(progress.currentAssignmentIndex)
    const assignments = StudentApiCalls.getAssignments(jwt) // todo remove mocked assignments when a route is created for the letter bar

    console.log(student)
    console.log(classAssignments)

    if (student && classroom) {
      this._isLoading = false
      this.setState({ assignments, progress, classCode, currentAssignment })
    }
  }

  onLoadingComplete () {
    this.setState({ isLoadComplete: true })
    this.props.history.replace(`/student/${this.state.username}`)
  }

  onWordCompletion (wordIndex, allWordsSpelled) {
    let { username, jwt, api, progress } = this.state
    progress.currentWordIndex = wordIndex
    if (allWordsSpelled) {
      progress.currentWordIndex = 0 // todo this is temporary so it resets, rather than be over
      console.log('All words have been spelled. For now the words will repeat')
      this.setState({ progress })
      this.props.history.push(`/student/${username}`)
    }
    api.putAssignments(jwt, progress)
  }

  onLetterCompletion () {
    console.log('all letters have been written')
    this.setState({ curLettersCompleted: true })
  }

  render () {
    const { currentAssignment, assignments, progress, isLoadComplete } = this.state
    if (!isLoadComplete) return <LoadingSpinner isLoading={this._isLoading} onLoadingAnimComplete={this.onLoadingComplete} />
    return (
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route exact path='/student/:username' render={(props) => <StudentHome {...props} assignments={assignments} progress={progress} />} />
          <Route path='/student/:username/writing' component={StudentWriting} />
          <Route path='/student/:username/spelling' render={() =>
            <DragDropContextProvider
              backend={TouchBackend}>  { /* this needed to be moved up from StudentSpelling because advancing to the next word would cause multiple HTML5Backend's to be instantiated */}
              <StudentSpelling wordsToSpell={currentAssignment.words}
                onWordCompletion={(wordIndex, allWordsSpelled) => this.onWordCompletion(wordIndex, allWordsSpelled)} />
            </DragDropContextProvider>} />
          <Route path='/student/:username/video' component={StudentVideo} />
        </Switch>
      </div>
    )
  }
}

StudentView.propTypes = {
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default StudentView
