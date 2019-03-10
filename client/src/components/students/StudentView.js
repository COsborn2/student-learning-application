import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import StudentHome from './StudentHome'
import { Route, Switch } from 'react-router-dom'
import { DragDropContextProvider } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import StudentApiCalls from '../../javascript/StudentApiCalls'
import LoadingScreen from '../loading/LoadingScreen'

const StudentSpelling = lazy(() => import('./StudentSpelling'))
const StudentWriting = lazy(() => import('./StudentWriting'))
const StudentVideo = lazy(() => import('./StudentVideo'))

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
      assignments: null,
      currentAssignment: null,
      currentLetterIndex: null,
      progress: null,
      letterLineArray: null,
      isLoading: true
    }
    this._triggerAnimFade = false
    this._isMounted = true
    this.onWordCompletion = this.onWordCompletion.bind(this)
    this.onLetterCompletion = this.onLetterCompletion.bind(this)
    this.onLoadingAnimationStop = this.onLoadingAnimationStop.bind(this)
  }

  /* At mount loads student assignmentId array, letter list, and progress */
  async componentDidMount () {
    let { jwt } = this.state
    // const res = await StudentApiCalls.getAssignmentsAndProgress(jwt) todo implement initStudent

    const progress = await StudentApiCalls.getProgressMock(jwt)
    const assignments = await StudentApiCalls.getAssignmentsMock(jwt)
    const letterLineArray = await StudentApiCalls.getLettersMock(jwt)
    const currentAssignment = assignments[progress.currentAssignmentIndex]
    let currentLetterIndex = this.getCurrentLetterIndex(progress, currentAssignment)

    if (assignments && this._isMounted) {
      this._triggerAnimFade = true
      this.setState({ assignments, progress, currentAssignment, letterLineArray, currentLetterIndex })
    }
  }

  componentWillUnmount () { this._isMounted = false }

  onLoadingAnimationStop () {
    if (this._isMounted) {
      this.setState({ isLoading: false })
      this.props.history.replace(`/student/${this.state.username}`)
    }
  }

  onWordCompletion (wordIndex, allWordsSpelled) {
    let { username, jwt, progress } = this.state
    progress.currentWordIndex = wordIndex
    if (allWordsSpelled) {
      progress.currentWordIndex = 0 // todo this is temporary so it resets, rather than be over
      console.log('All words have been spelled. For now the words will repeat')
      this.setState({ progress })
      this.props.history.push(`/student/${username}`)
    }
    StudentApiCalls.putAssignmentsMock(jwt, progress)
  }

  /***
   * Determines the current letter index to be used for the letter to be written, and the letter selected in the letter line.
   * If the student has finished all letters, it returns the last letter index in the assignment.
   * @param progress The current progress of the student
   * @param currentAssignment The current populated assignment
   * @returns {*} The current letter index
   */
  getCurrentLetterIndex (progress, currentAssignment) {
    if (progress.currentLetterIndex >= currentAssignment.letters.length) {
      return progress.currentLetterIndex - 1
    } else {
      return progress.currentLetterIndex
    }
  }

  /***
   * Is called every time a letter was successfully written.
   * If it was the last word in the assignment, The user is redirected to the home screen
   * @returns {Promise<boolean>} If the letters have been completed
   */
  async onLetterCompletion () {
    let { username, progress, currentAssignment } = this.state

    progress.currentLetterIndex++
    const didUpdate = await this.updateStudentProgress(progress)

    if (didUpdate) {
      this.setState({ progress: progress, currentLetterIndex: this.getCurrentLetterIndex(progress, currentAssignment) })

      if (progress.currentLetterIndex === currentAssignment.letters.length) {
        console.log('All letters have been written')
        this.props.history.push(`/student/${username}`)
      }
    } else {
      console.log('Update failed')
    }
  }

  /***
   * Calls api to update progress
   * @param progress Student's progress to update
   * @returns {Promise<boolean>} If the update was successful
   */
  async updateStudentProgress (progress) {
    let { jwt } = this.state
    let res = await StudentApiCalls.putAssignmentsMock(jwt, progress)

    if (res.error) {
      console.log('Some Error Calling Api to update assignment progress')
      return false
    } else {
      return true
    }
  }

  onLetterLineSelection (assignmentIndex, letterIndex) {
    console.log('No implemented yet')
  }

  render () {
    const { jwt, currentAssignment, progress, letterLineArray, currentLetterIndex, isLoading } = this.state
    if (isLoading) return <LoadingScreen triggerFadeAway={this._triggerAnimFade} onStopped={this.onLoadingAnimationStop} />
    return (
      <div style={{ background: '#a9a9a9' }}>
        <Suspense fallback={<LoadingScreen />}>
          <Switch>
            <Route exact path='/student/:username' render={(props) => <StudentHome {...props} progress={progress} letters={letterLineArray} onLetterLineSelection={(letter) => this.onLetterLineSelection(letter)} />} />
            <Route path='/student/:username/writing' render={() =>
              <StudentWriting letterToSpell={currentAssignment.letters[currentLetterIndex]} jwt={jwt} onLetterCompletion={this.onLetterCompletion} />}
            />
            <Route path='/student/:username/spelling' render={() =>
              <DragDropContextProvider backend={TouchBackend}>
                <StudentSpelling wordsToSpell={currentAssignment.words}
                  onWordCompletion={(wordIndex, allWordsSpelled) => this.onWordCompletion(wordIndex, allWordsSpelled)} />
              </DragDropContextProvider>} />
            <Route path='/student/:username/video' render={() => <StudentVideo />} />
          </Switch>
        </Suspense>
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
