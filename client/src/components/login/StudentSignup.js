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

class StudentSignup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      failedMessage: '',
      showMessage: false
    }
  }

  async handleSignup (event) {
    const form = event.currentTarget
    if (form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }

    const courseCode = form.elements.courseCodeField.value
    const userName = form.elements.userNameField.value

    let res = await StudentApiCalls.signup(courseCode, userName)

    if (res.error) this.animateMessage(res.error)
    else if (res.jwt) {
      window.sessionStorage.setItem(`studentjwt`, res.jwt)
      this.props.history.replace(`/student/${userName}`) // navigates to the proper user screen, passing the jwt
    } else this.animateMessage('Whoops... An error occurred, Try again')
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
      <React.Fragment>
        <Form onSubmit={e => this.handleSignup(e)}>
          <ModalDialog>
            <ModalHeader>
              <ModalTitle>Student Sign Up</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <Form.Group>
                <Form.Label>Course Code</Form.Label>
                <Form.Control
                  name='courseCodeField'
                  required
                  type='text'
                  placeholder='course code' />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name='userNameField'
                  required
                  type='text'
                  placeholder='text' />
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
      </React.Fragment>
    )
  }
}

StudentSignup.propTypes = {
  history: PropTypes.object.isRequired
}

export default StudentSignup
