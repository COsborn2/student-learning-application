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
      isLoading: true
    }
    this._triggerAnimFade = false
    this._isMounted = true
    this.getSelectedLetterIndex = this.getSelectedLetterIndex.bind(this)
    this.onWordCompletion = this.onWordCompletion.bind(this)
    this.onLetterCompletion = this.onLetterCompletion.bind(this)
    this.onLetterLineSelection = this.onLetterLineSelection.bind(this)
    this.onLoadingAnimationStop = this.onLoadingAnimationStop.bind(this)
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
    const currentAssignmentIndex = progress.currentAssignmentIndex
    const currentLetterIndex = this.getSelectedLetterIndex(progress, currentAssignment)

    if (assignmentIds && this._isMounted) {
      this._triggerAnimFade = true
      this.setState({
        assignmentIds,
        currentAssignment,
        currentAssignmentIndex,
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
   * @param wordIndex The word index to update to
   * @param allWordsSpelled If all the words have been spelled
   */
  async onWordCompletion (wordIndex, allWordsSpelled) {
    let { username, progress } = this.state
    progress.currentWordIndex = wordIndex
    if (allWordsSpelled) {
      console.log('All words have been spelled.')
      this.setState({ progress })
      this.props.history.push(`/student/${username}`)
    }
    await this.updateStudentProgress(progress)
  }

  /***
   * Is called every time a letter was successfully written. Updates user progress
   * If it was the last word in the assignment, The user is redirected to the home screen
   */
  async onLetterCompletion () {
    let { username, progress, currentAssignment } = this.state

    progress.currentLetterIndex++
    const didUpdate = await this.updateStudentProgress(progress)

    if (didUpdate) {
      this.setState({ progress: progress, currentLetterIndex: this.getSelectedLetterIndex(progress, currentAssignment) })

      if (progress.currentLetterIndex === currentAssignment.letters.length) {
        console.log('All letters have been written')
        this.props.history.push(`/student/${username}`)
      }
    } else {
      console.log('Update failed')
    }
  }

  /***
   * Determines the current letter index to be used for the letter to be written, and the letter selected in the letter line.
   * If the student has finished all letters, it returns the last letter index in the assignment.
   * @param progress The current progress of the student
   * @param currentAssignment The current populated assignment
   * @returns {*} The current letter index
   */
  getSelectedLetterIndex (progress, currentAssignment) {
    return (progress.currentLetterIndex >= currentAssignment.letters.length)
      ? progress.currentLetterIndex - 1
      : progress.currentLetterIndex
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

  /***
   * Is triggered when the user clicks an unlocked letter on the letterLine
   * @param selectedAssignmentIndex The assignment index of the letter selected
   * @param selectedLetterIndex The letter index of the letter selected
   * @returns {Promise<void>}
   */
  async onLetterLineSelection (selectedAssignmentIndex, selectedLetterIndex) {
    let { assignmentIds, currentAssignment, currentAssignmentIndex, currentLetterIndex } = this.state

    if (selectedAssignmentIndex === currentAssignmentIndex && selectedLetterIndex === currentLetterIndex) return null // if its the already selected letter do nothing

    this.setState({ isLoading: true })
    currentAssignmentIndex = selectedAssignmentIndex
    currentLetterIndex = selectedLetterIndex
    currentAssignment = await StudentApiCalls.getAssignmentById(assignmentIds[selectedAssignmentIndex].assignmentId)
    this._triggerAnimFade = true
    this.setState({ currentAssignment, currentAssignmentIndex, currentLetterIndex })
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
    const { jwt, currentAssignment, currentLetterIndex, isLoading } = this.state
    if (isLoading) return <LoadingScreen triggerFadeAway={this._triggerAnimFade} onStopped={this.onLoadingAnimationStop} />
    return (
      <Suspense fallback={<LoadingScreen />}>
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
              <StudentSpelling wordsToSpell={currentAssignment.words}
                onWordCompletion={(wordIndex, allWordsSpelled) => this.onWordCompletion(wordIndex, allWordsSpelled)} />
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
