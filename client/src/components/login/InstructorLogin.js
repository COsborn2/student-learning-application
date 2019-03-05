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

const messageStyles = {
  messageFading: {
    color: 'red',
    transition: 'opacity 1.0s',
    opacity: 0
  },
  messageShow: {
    color: 'red',
    opacity: 1
  }
}

class InstructorLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      failedMessage: '',
      showMessage: false
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleSkipLogin = this.handleSkipLogin.bind(this) // todo remove dev skip
  }

  // Hit backend for verification
  async handleLogin (event) {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      console.log('isInvalid')
      event.preventDefault()
      event.stopPropagation()
    }
    console.log('passed validate')
    const password = form.elements.passField.value
    const email = form.elements.emailField.value

    let res = await InstructorApiCalls.login(email, password)

    if (res.error) this.animateMessage(res.error)
    else if (res.jwt) {
      window.sessionStorage.setItem(`instructorjwt`, res.jwt)
      this.props.history.replace(`/instructor/${email}`) // navigates to the proper user screen, passing the jwt
    } else this.animateMessage('Whoops... An error occurred, Try again')
  }

  handleSkipLogin () { // todo remove dev skip
    window.sessionStorage.setItem('instructorjwt', 'ValidInstructorJWT')
    this.props.history.replace(`/instructor/dev-instructor`)
  }

  animateMessage (msg) {
    this.setState({ failedMessage: msg, showMessage: true })

    setTimeout(() => {
      this.setState({ showMessage: false })
    }, 1000)
  }

  render () {
    let errorMessageStyle = this.state.showMessage ? messageStyles.messageShow : messageStyles.messageFading
    return (
      <Form validated={false} onSubmit={e => this.handleLogin(e)}>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>Instructor Login</ModalTitle>
            <div className='flex-fill' />
            <Button className='btn-warning mx-2' onClick={this.handleSkipLogin}>Dev Skip</Button>
            <Button onClick={() => this.props.history.replace('/signup/instructor')}>Signup</Button>
          </ModalHeader>

          <ModalBody>
            <Form.Group as={Col} controlId='emailInputGroup'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name='emailField'
                type='email'
                placeholder='Email' />
              <Form.Control.Feedback type='invalid'>
                Please provide a valid email
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} controlId='passwordInputGroup'>
              <Form.Label>password</Form.Label>
              <Form.Control
                name='passField'
                type='password'
                placeholder='password' />
              <Form.Control.Feedback type='invalid'>
                Please provide a valid password
              </Form.Control.Feedback>
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
    )
  }
}

InstructorLogin.propTypes = {
  history: PropTypes.object.isRequired
}

export default InstructorLogin
