import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalTitle from 'react-bootstrap/ModalTitle'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import Col from 'react-bootstrap/Col'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'
import { AuthMessageStyles as messageStyles } from './AuthMessageStyles'

class InstructorSignup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      failedMessage: '',
      showMessage: false,
      validated: false
    }
  }

  async handleSignup (event) {
    const form = event.currentTarget
    event.preventDefault()
    this.setState({ validated: true })
    if (form.checkValidity() === false) {
      event.stopPropagation()
      return
    }

    const email = form.elements.emailField.value
    const password = form.elements.passField.value

    let res = await InstructorApiCalls.signup(email, password)

    if (res.error) this.animateMessage(res.error)
    else if (res.jwt) {
      const id = email.split('@')[0]
      window.sessionStorage.setItem('instructorid', id)
      window.sessionStorage.setItem('instructorjwt', res.jwt)
      this.props.history.replace(`/instructor/${id}`)
    } else this.animateMessage('Whoops... An error occurred, Try again')
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
      <Form noValidate validated={validated} onSubmit={e => this.handleSignup(e)}>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>Instructor Sign Up</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <Form.Group as={Col}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                name='emailField'
                type='email'
                placeholder='email' />
              <Form.Control.Feedback type='invalid'>Please provide a valid email</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                name='passField'
                type='password'
                placeholder='Password' />
              <Form.Control.Feedback type='invalid'>Please provide a valid password</Form.Control.Feedback>
            </Form.Group>
          </ModalBody>

          <ModalFooter>
            <p style={errorMessageStyle}>{this.state.failedMessage}</p>
            <div style={{ flex: 1 }} />
            <Button onClick={() => this.props.history.push('/')}>Close</Button>
            <Button type='submit'>Sign Up</Button>
          </ModalFooter>
        </ModalDialog>
      </Form>
    )
  }
}

InstructorSignup.propTypes = {
  history: PropTypes.object.isRequired
}

export default InstructorSignup
