import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalTitle from 'react-bootstrap/ModalTitle'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'

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

class SignupScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      failedMessage: '',
      showMessage: false,
      api: InstructorApiCalls
    }
  }

  async handleSignup (event) {
    const form = event.currentTarget
    if (form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }

    let { api } = this.state
    const password = form.elements.passField.value
    const id = form.elements.idField.value

    let res = await api.verifySignup(id, password)

    if (res.jwt) {
      window.sessionStorage.setItem(`instructorjwt`, res.jwt)
      this.props.history.replace(`/instructor/${id}`) // navigates to the proper user screen, passing the jwt
    }
    if (res.error) this.animateMessage(res.error)
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
              <ModalTitle>Instructor Sign Up</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name='idField'
                  required
                  type='text'
                  placeholder='Id' />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name='passField'
                  required
                  type='password'
                  placeholder='Password' />
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

SignupScreen.propTypes = {
  history: PropTypes.object.isRequired
}

export default SignupScreen
