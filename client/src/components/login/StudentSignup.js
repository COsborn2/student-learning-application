import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalTitle from 'react-bootstrap/ModalTitle'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import StudentApiCalls from '../../javascript/StudentApiCalls'
import Col from 'react-bootstrap/Col'
import { AuthMessageStyles as messageStyles } from './AuthMessageStyles'

class StudentSignup extends Component {
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

    const courseCode = form.elements.courseCodeField.value
    const userName = form.elements.userNameField.value

    let res = await StudentApiCalls.signup(courseCode, userName)

    if (res.error) this.animateMessage(res.error)
    else if (res.jwt) {
      window.sessionStorage.setItem('studentid', userName)
      window.sessionStorage.setItem(`studentjwt`, res.jwt)
      this.props.history.replace(`/student/${userName}`) // navigates to the proper user screen, passing the jwt
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
            <ModalTitle>Student Sign Up</ModalTitle>
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
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                name='userNameField'
                type='text'
                placeholder='text' />
              <Form.Control.Feedback type='invalid'> Please provide a valid username</Form.Control.Feedback>
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

StudentSignup.propTypes = {
  history: PropTypes.object.isRequired
}

export default StudentSignup
