import React, { Component } from 'react'
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
import PropTypes from 'prop-types'

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

/* The signupModal creates a new user object based on the type parameter in the url
it uses this to create a new user. When a new user is succesfully created, the client is redirected
to the proper user screen and is signed in
 */

class SignupModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      failedMessage: '',
      showMessage: false,
      user: this.props.history.location.state
    }
    this.handleSignup = this.handleSignup.bind(this)
  }

  handleSignup () {
    const password = this._passwordInput.value
    const id = this._idInput.value
    let user = this.state.user

    if (id === '') {
      this.animateMessage('* A username is required')
    } else if (password === '') {
      this.animateMessage('* A password is required')
    }

    let isAuth = user.verifySignup(id, password)
    if (isAuth) {
      this.props.history.replace('/' + this.state.user.TYPE + '/' + this.state.user.id, this.state.user) // navigates to the proper user screen, passing the authenticated user as a prop
    } else {
      this.animateMessage('* Invalid username or password')
    }
  }

  animateMessage (msg) {
    this.setState({ failedMessage: msg, showMessage: true })

    setTimeout(() => {
      this.setState({ showMessage: false })
    }, 1000)
  }

  render () {
    let errorMessageStyle = this.state.showMessage ? messageStyles.messageShow : messageStyles.messageFading
    let type = this.props.match.arguments
    return (
      <div className='modal-dialog-centered'>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>{type} Sign Up</ModalTitle>
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
            <Button bsStyle='primary' type={'submit'} onClick={this.handleSignup}>Sign Up</Button>
          </ModalFooter>
        </ModalDialog>
      </div>
    )
  }
}

SignupModal.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

export default SignupModal
