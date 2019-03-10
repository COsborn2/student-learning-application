import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalTitle from 'react-bootstrap/ModalTitle'
import Form from 'react-bootstrap/Form'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import Button from 'react-bootstrap/Button'
import StudentApiCalls from '../../javascript/StudentApiCalls.js'
import Col from 'react-bootstrap/Col'
import { AuthMessageStyles as messageStyles } from './AuthMessageStyles'
import LoadingOverlay from '../loading/LoadingOverlay'

class StudentLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      failedMessage: '',
      showMessage: false,
      validated: false,
      isLoading: false
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleSkipLogin = this.handleSkipLogin.bind(this) // todo remove dev skip
    this.handleSignup = this.handleSignup.bind(this)
  }

  // Hit backend for verification
  async handleLogin (event) {
    const form = event.currentTarget
    event.preventDefault()
    this.setState({ validated: true })
    if (form.checkValidity() === false) {
      event.stopPropagation()
      return
    }

    const classCode = form.elements.courseCodeField.value
    const username = form.elements.userNameField.value

    this.setState({ isLoading: true })
    let res = await StudentApiCalls.login(classCode, username)
    this.setState({ isLoading: false })

    if (res.error) this.animateMessage(res.error)
    else if (res.jwt) {
      window.sessionStorage.setItem('student', JSON.stringify(res))
      this.props.history.replace(`/student/${res.username}`)
    } else this.animateMessage('Whoops... An error occurred, Try again')
  }

  async handleSkipLogin () { // todo remove dev skip
    let res = await StudentApiCalls.login('someClasscode', 'someUsername')
    if (res.error) this.animateMessage(res.error)
    else if (res.jwt) {
      window.sessionStorage.setItem('student', JSON.stringify(res))
      this.props.history.replace(`/student/${res.username}`)
    } else this.animateMessage('Whoops... An error occurred, Try again')
  }

  animateMessage (msg) {
    this.setState({ failedMessage: msg, showMessage: true })

    setTimeout(() => {
      this.setState({ showMessage: false })
    }, 3000)
  }

  handleSignup () {
    this.props.history.replace('/signup/student') // todo remove dev skip for easy access
  }

  render () {
    const { validated, showMessage, isLoading } = this.state
    let errorMessageStyle = showMessage ? messageStyles.messageShow : messageStyles.messageFading
    return (
      <React.Fragment>
        <LoadingOverlay show={isLoading} />
        <Form noValidate validated={validated} onSubmit={e => this.handleLogin(e)}>
          <ModalDialog>
            <ModalHeader>
              <ModalTitle>Student Login</ModalTitle>
              <div className='flex-fill' />
              <Button className='btn-warning mx-2' onClick={this.handleSkipLogin}>Dev Skip</Button>
              <Button onClick={() => this.props.history.replace('/signup/student')}>Signup</Button>
            </ModalHeader>

            <ModalBody>
              <Form.Group as={Col}>
                <Form.Label>Course Code</Form.Label>
                <Form.Control
                  required
                  name='courseCodeField'
                  type='text'
                  placeholder='course code' />
                <Form.Control.Feedback type='invalid'> Please provide a valid course code</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  required
                  name='userNameField'
                  type='text'
                  placeholder='username' />
                <Form.Control.Feedback type='invalid'> Please provide a valid username </Form.Control.Feedback>
              </Form.Group>

            </ModalBody>

            <ModalFooter>
              <p style={errorMessageStyle}>{this.state.failedMessage}</p>
              <div className='flex-fill' />
              <Button onClick={() => this.props.history.push('/')}>Close</Button>
              <Button type='submit'>Log in</Button>
            </ModalFooter>
          </ModalDialog>
        </Form>
      </React.Fragment>
    )
  }
}

StudentLogin.propTypes = {
  history: PropTypes.object.isRequired
}

export default StudentLogin
