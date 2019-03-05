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

class InstructorLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      failedMessage: '',
      showMessage: false,
      validated: false
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleSkipLogin = this.handleSkipLogin.bind(this) // todo remove dev skip
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

    const password = form.elements.passField.value
    const email = form.elements.emailField.value

    let res = await InstructorApiCalls.login(email, password)

    if (res.error) this.animateMessage(res.error)
    else if (res.jwt) {
      const id = email.split('@')[0]
      window.sessionStorage.setItem('instructorid', id)
      window.sessionStorage.setItem('instructorjwt', res.jwt)
      this.props.history.replace(`/instructor/${id}`) // navigates to the proper user screen, passing the jwt
    } else this.animateMessage('Whoops... An error occurred, Try again')
  }

  handleSkipLogin () { // todo remove dev skip
    window.sessionStorage.setItem('instructorid', 'dev-instructor')
    window.sessionStorage.setItem('instructorjwt', 'ValidInstructorJWT')
    this.props.history.replace(`/instructor/dev-instructor`)
  }

  animateMessage (msg) {
    this.setState({ failedMessage: msg, showMessage: true })

    setTimeout(() => {
      this.setState({ showMessage: false })
    }, 3000)
  }

  render () {
    const { validated, showMessage } = this.state
    let errorMessageStyle = showMessage ? messageStyles.messageShow : messageStyles.messageFading
    return (
      <Form noValidate validated={validated} onSubmit={e => this.handleLogin(e)}>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>Instructor Login</ModalTitle>
            <div className='flex-fill' />
            <Button className='btn-warning mx-2' onClick={this.handleSkipLogin}>Dev Skip</Button>
            <Button onClick={() => this.props.history.replace('/signup/instructor')}>Signup</Button>
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
    )
  }
}

InstructorLogin.propTypes = {
  history: PropTypes.object.isRequired
}

export default InstructorLogin
