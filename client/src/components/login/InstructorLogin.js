import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalTitle from 'react-bootstrap/ModalTitle'
import Form from 'react-bootstrap/Form'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import Button from 'react-bootstrap/Button'
import InstructorApiCalls from '../../javascript/InstructorApiCalls.js'
import Col from 'react-bootstrap/Col'
import { AuthMessageStyles as messageStyles } from './AuthMessageStyles'
import LoadingOverlay from '../loading/LoadingOverlay'

/**
 * This component manages the instructor login
 */
class InstructorLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      failedMessage: '',
      showMessage: false,
      validated: false,
      isLoading: false
    }
    this.handleLogin = this.handleLogin.bind(this)
  }

  /**
   * This method is called when the login button is clicked
   * @param event The onSubmit event created by the form
   */
  async handleLogin (event) {
    const form = event.currentTarget
    event.preventDefault()
    this.setState({ validated: true })
    if (form.checkValidity() === false) {
      event.stopPropagation()
      return
    }

    const password = form.elements.passField.value
    const email = form.elements.emailField.value

    this.setState({ isLoading: true })
    let res = await InstructorApiCalls.login(email, password)
    this.setState({ isLoading: false })

    if (res.error) this.animateMessage(res.error)
    else if (res.jwt) {
      window.sessionStorage.setItem('instructor', JSON.stringify(res))
      this.props.history.replace(`/instructor/${res.name}`)
    } else this.animateMessage('Whoops... An error occurred, Try again')
  }

  /**
   * This is called when an error message needs to be displayed. It fades out after 3 seconds
   * @param msg The message to display to the user
   */
  animateMessage (msg) {
    this.setState({ failedMessage: msg, showMessage: true })

    setTimeout(() => {
      this.setState({ showMessage: false })
    }, 3000)
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
              <ModalTitle>Instructor Login</ModalTitle>
              <div className='flex-fill' />
              <Button onClick={() => this.props.history.push('/signup/instructor')}>Signup</Button>
            </ModalHeader>

            <ModalBody>
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  name='emailField'
                  type='email'
                  placeholder='Email' />
                <Form.Control.Feedback type='invalid'> Please provide a valid email</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  name='passField'
                  type='password'
                  placeholder='password' />
                <Form.Control.Feedback type='invalid'> Please provide a valid password</Form.Control.Feedback>

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

InstructorLogin.propTypes = {
  history: PropTypes.object.isRequired
}

export default InstructorLogin
