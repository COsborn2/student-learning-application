import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import StudentHome from './StudentHome'
import { Route, Switch } from 'react-router-dom'
import { DragDropContextProvider } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import StudentApiCalls from '../../javascript/StudentApiCalls'
import LoadingScreen from '../loading/LoadingScreen'
import StudentToolbar from '../menu/StudentToolbar'

const StudentSpelling = lazy(() => import('./StudentSpelling'))
const StudentWriting = lazy(() => import('./StudentWriting'))
const StudentVideo = lazy(() => import('./StudentVideo'))

/***
 The student view manages all screens and routes for a specific student user
 the login screen creates and authenticates a student object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen
 */
class StudentView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: this.props.user.username,
      jwt: this.props.user.jwt,
      progress: this.props.user.progress,
      assignmentIds: null,
      currentAssignment: null,
      currentAssignmentIndex: null,
      currentLetterIndex: null,
      currentWordIndex: null,
      isLoading: true
    }
    this._triggerAnimFade = false
    this._isMounted = true
    this.onWordCompletion = this.onWordCompletion.bind(this)
    this.onLetterCompletion = this.onLetterCompletion.bind(this)
    this.onLetterLineSelection = this.onLetterLineSelection.bind(this)
    this.onLoadingAnimationStop = this.onLoadingAnimationStop.bind(this)
    this.advanceToNextAssignment = this.advanceToNextAssignment.bind(this)
    this.onCourseCompleted = this.onCourseCompleted.bind(this)
  }

  /***
   * This is called when the component mounts. It loads assignmentIds, populated current assignment, and letters
   */
  async componentDidMount () {
    let { jwt, progress } = this.state
    let res = await StudentApiCalls.getInitialStudentState(jwt)

    if (res.error) {
      this.props.history.push('/error', res.error)
    }

    const assignmentIds = res.assignmentIds
    const currentAssignment = res.currentAssignment
    const currentAssignmentIndex = this.clampValue(progress.currentAssignmentIndex, assignmentIds.length)
    const currentLetterIndex = this.clampValue(progress.currentLetterIndex, currentAssignment.letters.length)
    const currentWordIndex = this.clampValue(progress.currentWordIndex, currentAssignment.words.length)

    if (assignmentIds && this._isMounted) {
      this._triggerAnimFade = true
      this.setState({
        assignmentIds,
        currentAssignment,
        currentAssignmentIndex,
        currentWordIndex,
        currentLetterIndex
      })
    } else {
      this.props.history.push('/error', 'Api failed to return required data')
    }
  }

  componentWillUnmount () { this._isMounted = false }

  /***
   * This method is called when the loading animation has finished fading out
   */
  onLoadingAnimationStop () {
    if (this._isMounted) {
      this._triggerAnimFade = false
      this.setState({ isLoading: false })
      this.props.history.replace(`/student/${this.state.username}`)
    }
  }

  /***
   * Is called every time a word was successfully spelled. Updates user progress
   */
  async onWordCompletion () {
    let { username, progress, currentAssignment, currentAssignmentIndex, currentWordIndex } = this.state
    let didUpdate = true

    // need to check if user is on an old letter, dont change progress if they are
    if (currentAssignmentIndex === progress.currentAssignmentIndex && currentWordIndex === progress.currentWordIndex) {
      progress.currentWordIndex++
      didUpdate = await this.updateStudentProgress(progress)
    }

    currentWordIndex++

    if (didUpdate) {
      this.setState({ progress: progress, currentWordIndex: this.clampValue(currentWordIndex, currentAssignment.words.length) })
      if (currentWordIndex === currentAssignment.words.length) {
        window.alert('All words in this assignment have been spelled. Advancing to next assignment')
        this.props.history.push(`/student/${username}`)
        await this.advanceToNextAssignment() // this assumes you cant spell till you have completed writing
      }
    }
  }

  /***
   * Is called every time a letter was successfully written. Updates user progress
   * If it was the last letter in the assignment, The user is redirected to the home screen
   */
  async onLetterCompletion () {
    let { username, progress, currentAssignment, currentAssignmentIndex, currentLetterIndex } = this.state
    let didUpdate = true

    // need to check if user is on an old letter, dont change progress if they are
    if (currentAssignmentIndex === progress.currentAssignmentIndex && currentLetterIndex === progress.currentLetterIndex) {
      progress.currentLetterIndex++
      didUpdate = await this.updateStudentProgress(progress)
    }

    currentLetterIndex++

    if (didUpdate) {
      this.setState({ progress: progress, currentLetterIndex: this.clampValue(currentLetterIndex, currentAssignment.letters.length) })
      if (currentLetterIndex === currentAssignment.letters.length) {
        window.alert('All letters in this assignment have been written')
        this.props.history.push(`/student/${username}`)
      }
    } else {
      console.log('Update failed')
    }
  }

  /***
   * Is triggered when all the words in an assignment are complete
   * @returns {Promise<void>}
   */
  async advanceToNextAssignment () {
    let { progress, assignmentIds, currentAssignment, currentAssignmentIndex, currentLetterIndex, currentWordIndex } = this.state

    if (currentAssignmentIndex === progress.currentAssignmentIndex) {
      progress.currentAssignmentIndex++
      progress.currentWordIndex = 0
      progress.currentLetterIndex = 0
    }

    if (progress.currentAssignmentIndex === assignmentIds.length) this.onCourseCompleted()

    currentAssignmentIndex++

    // if the new assignment, is the current students assignment, instead of resetting, load progress
    if (progress.currentAssignmentIndex === currentAssignmentIndex) {
      currentWordIndex = progress.currentWordIndex
      currentLetterIndex = progress.currentLetterIndex
    } else {
      currentWordIndex = 0
      currentLetterIndex = 0
    }

    this.setState({ isLoading: true })
    currentAssignment = await StudentApiCalls.getAssignmentById(assignmentIds[currentAssignmentIndex].assignmentId)
    this._triggerAnimFade = true
    this.setState({ progress,
      assignmentIds,
      currentAssignment,
      currentAssignmentIndex: this.clampValue(currentAssignmentIndex, assignmentIds.length),
      currentWordIndex: this.clampValue(currentWordIndex, currentAssignment.words.length),
      currentLetterIndex: this.clampValue(currentLetterIndex, currentAssignment.letters.length)
    })
    console.log(`Current assignment: ${currentAssignmentIndex}`)
  }

  /**
   * Triggered when the entire course has been completed
   */
  onCourseCompleted () {
    let progress = this.state.progress
    progress.finishedCourse = true

    this.setState({ progress })
    window.alert('Yay you finished the course')
  }

  /***
   * This is used to ensure the current assignment index, current word index, current letter index are all valid
   * @param valueToClamp The letter to ensure is never to large
   * @param maximum The ceiling of the number, It cannot be equal to this
   * @returns {number} The clamped number
   */
  clampValue (valueToClamp, maximum) {
    return (valueToClamp >= maximum)
      ? valueToClamp - 1
      : valueToClamp
  }

  /***
   * Calls api to update progress
   * @param progress Student's progress to update
   * @returns {Promise<boolean>} If the update was successful
   */
  async updateStudentProgress (progress) {
    let { jwt } = this.state
    let res = await StudentApiCalls.updateStudentProgress(jwt, progress)

    if (res.error) {
      console.log('Some Error Calling Api to update assignment progress')
      return false
    } else {
      return true
    }
  }

  /***
   * Is triggered when the user clicks an unlocked letter on the letterLine
   * @param selectedAssignmentIndex The assignment index of the letter selected
   * @param selectedLetterIndex The letter index of the letter selected
   * @returns {Promise<void>}
   */
  async onLetterLineSelection (selectedAssignmentIndex, selectedLetterIndex) {
    let { progress, assignmentIds, currentAssignment, currentAssignmentIndex, currentWordIndex, currentLetterIndex } = this.state

    if (selectedAssignmentIndex === currentAssignmentIndex && selectedLetterIndex === currentLetterIndex) return null // if its the already selected letter do nothing

    this.setState({ isLoading: true })
    currentAssignmentIndex = selectedAssignmentIndex
    currentLetterIndex = selectedLetterIndex
    currentWordIndex = 0
    currentAssignment = await StudentApiCalls.getAssignmentById(assignmentIds[selectedAssignmentIndex].assignmentId)
    this._triggerAnimFade = true
    this.setState({ progress, currentAssignment, currentAssignmentIndex, currentWordIndex, currentLetterIndex })
  }

  /***
   * Bundles and returns all data necessary to determine the style of the letterLine buttons
   * @returns {{unlockedLetterIndex: number, assignmentIds: array, unlockedAssignmentIndex: number, selectedAssignmentIndex: number, selectedLetterIndex: number}}
   */
  getLetterLineInfo () {
    const { progress, assignmentIds, currentAssignmentIndex, currentLetterIndex } = this.state
    return {
      assignmentIds: assignmentIds,
      unlockedAssignmentIndex: progress.currentAssignmentIndex,
      unlockedLetterIndex: progress.currentLetterIndex,
      selectedAssignmentIndex: currentAssignmentIndex,
      selectedLetterIndex: currentLetterIndex
    }
  }

  render () {
    const { jwt, currentAssignment, currentLetterIndex, currentWordIndex, isLoading } = this.state
    if (isLoading) return <LoadingScreen triggerFadeAway={this._triggerAnimFade} onStopped={this.onLoadingAnimationStop} />
    return (
      <Suspense fallback={<LoadingScreen />}>
        <StudentToolbar />
        <Switch>
          <Route exact path='/student/:username' render={(props) =>
            <StudentHome {...props} letterLineInfo={this.getLetterLineInfo()}
              onLetterLineSelection={(assignment, letter) => this.onLetterLineSelection(assignment, letter)} />}
          />
          <Route path='/student/:username/writing' render={() =>
            <StudentWriting letterToSpell={currentAssignment.letters[currentLetterIndex]}
              jwt={jwt} onLetterCompletion={this.onLetterCompletion} />}
          />
          <Route path='/student/:username/spelling' render={() =>
            <DragDropContextProvider backend={TouchBackend}>
              <StudentSpelling wordToSpell={currentAssignment.words[currentWordIndex]}
                onWordCompletion={() => this.onWordCompletion()} />
            </DragDropContextProvider>}
          />
          <Route path='/student/:username/video' render={() => <StudentVideo />} />
        </Switch>
      </Suspense>
    )
  }
}

StudentView.propTypes = {
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default StudentView
