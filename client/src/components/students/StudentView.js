import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import StudentHome from './StudentHome'
import { Route, Switch } from 'react-router-dom'
import { DragDropContextProvider } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import StudentApiCalls from '../../javascript/StudentApiCalls'
import LoadingScreen from '../loading/LoadingScreen'
import LoadingGif from '../../assets/images/LoadingScreenGif.gif'

const StudentSpelling = lazy(() => import('./StudentSpelling'))
const StudentWriting = lazy(() => import('./StudentWriting'))
const StudentVideo = lazy(() => import('./StudentVideo'))
const centerStyle = { top: 0, bottom: 0, left: 0, right: 0 }

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
      progress: null,
      letters: null,
      isLoading: true
    }
    this._triggerAnimFade = false
    this._isMounted = true
    this.onWordCompletion = this.onWordCompletion.bind(this)
    this.onLoadingAnimationStop = this.onLoadingAnimationStop.bind(this)
  }

  /* At mount loads student assignmentId array, letter list, and progress */
  async componentDidMount () {
    let { jwt } = this.state
    // const res = await StudentApiCalls.getAssignmentsAndProgress(jwt) todo implement initStudent

    const progress = await StudentApiCalls.getProgressMock(jwt)
    const assignments = await StudentApiCalls.getAssignmentsMock(jwt)
    const letters = await StudentApiCalls.getLettersMock(jwt)
    const currentAssignment = assignments[progress.currentAssignmentIndex]

    if (assignments && this._isMounted) {
      this._triggerAnimFade = true
      this.setState({ assignments, progress, currentAssignment, letters })
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

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

  onLetterCompletion () {
    console.log('all letters have been written')
    this.setState({ curLettersCompleted: true })
  }

  render () {
    const { currentAssignment, progress, letters, isLoading } = this.state
    if (isLoading) return <LoadingScreen triggerFadeAway={this._triggerAnimFade} onStopped={this.onLoadingAnimationStop} />
    return (
      <div style={{ background: '#a9a9a9' }}>
        <Suspense fallback={<img src={LoadingGif} alt='Loading...' className='img-fluid position-absolute m-auto fade-in' style={centerStyle} />}>
          <Switch>
            <Route exact path='/student/:username' render={(props) => <StudentHome {...props} progress={progress} letters={letters} />} />
            <Route path='/student/:username/writing' render={(props) => <StudentWriting />} />
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
