import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ModalBody,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  FormControl,
  FormGroup, ControlLabel, Form
} from 'react-bootstrap'
import InstructorObj from '../../javascript/InstructorObj'
import StudentObj from '../../javascript/StudentObj'

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

/* The loginModal creates a new user object based on the type parameter in the url
 ie '/login/student' will create a new studentObj and use it to authenticate using
 the credentials entered. When auth is validated, the client is redirected to the
 correct screen with the userObj passed as a property
 */

class LoginScreen extends Component {
  constructor (props) {
    super(props)
    let type = this.props.match.params.type
    let user = type === 'instructor' ? new InstructorObj() : new StudentObj()
    this.state = {
      failedMessage: '',
      showMessage: false,
      user: user
    }
    this.handleVerifyAuth = this.handleVerifyAuth.bind(this)
    this.handleSkipAuth = this.handleSkipAuth.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
  }

  // Hit backend for verification
  handleVerifyAuth () {
    const password = this._passwordInput.value
    const id = this._idInput.value

    if (id === '') {
      this.animateMessage('* A username is required')
    } else if (password === '') {
      this.animateMessage('* A password is required')
    }

    let isAuth = this.state.user.verifyAuth(id, password)
    if (isAuth) {
      this.props.history.replace('/' + this.state.user.TYPE + '/' + this.state.user.id, this.state.user) // navigates to the proper user screen, passing the authenticated user as a prop
    } else {
      this.animateMessage('* Incorrect username or password')
    }
  }

  animateMessage (msg) {
    this.setState({ failedMessage: msg, showMessage: true })

    setTimeout(() => {
      this.setState({ showMessage: false })
    }, 1000)
  }

  handleSkipAuth () {
    let user = this.state.user
    let isAuth = user.verifyAuth(user.TYPE + 'Dev', 'password')
    if (isAuth) {
      this.props.history.replace('/' + user.TYPE + '/' + user.id, this.state.user) // todo remove dev skip for easy access
    }
  }

  handleSignup () {
    let user = this.state.user
    this.props.history.replace('/signup/' + user.TYPE, user) // todo remove dev skip for easy access
  }

  render () {
    let errorMessageStyle = this.state.showMessage ? messageStyles.messageShow : messageStyles.messageFading
    let type = this.state.user.TYPE.charAt(0).toLocaleUpperCase() + this.state.user.TYPE.slice(1)
    return (
      <div className='modal-dialog-centered'>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>{type} Login</ModalTitle>
            <Button bsStyle='warning' onClick={this.handleSkipAuth}>Dev Skip</Button>
            <Button bsStyle='info' onClick={this.handleSignup}>Signup</Button>
          </ModalHeader>

          <ModalBody>
            <Form>
              <FormGroup>
                <ControlLabel>User Id</ControlLabel>
                <FormControl type='text'
                  placeholder='Id'
                  inputRef={(ref) => { this._idInput = ref }} />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl type='password'
                  placeholder='Password'
                  inputRef={(ref) => { this._passwordInput = ref }} />
              </FormGroup>
            </Form>

          </ModalBody>

          <ModalFooter>
            <p style={errorMessageStyle}>{this.state.failedMessage}</p>
            <div style={{ flex: 1 }} />
            <Button bsStyle='primary' onClick={() => this.props.history.push('/')}>Close</Button>
            <Button bsStyle='primary' type={'submit'} onClick={this.handleVerifyAuth}>Log in</Button>
          </ModalFooter>
        </ModalDialog>
      </div>
    )
  }
}

LoginScreen.propTypes = {
  history: PropTypes.object.isRequired
}

export default LoginScreen
