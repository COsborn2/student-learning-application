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

class LoginModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      failedMessage: '',
      showMessage: false
    }

    this.handleVerifyAuth = this.handleVerifyAuth.bind(this)
    this.handleSkipAuth = this.handleSkipAuth.bind(this)
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

    let isAuth = this.props.user.verifyAuth(id, password)
    if (isAuth) {
      this.props.onAuthenticate()
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
    let isAuth = this.props.user.verifyAuth('StudentDev', 'password')
    console.log(isAuth)
    if (isAuth) this.props.onAuthenticate()// todo remove dev skip for easy access
  }

  render () {
    let errorMessageStyle = this.state.showMessage ? messageStyles.messageShow : messageStyles.messageFading
    return (
      <div className='modal-dialog-centered'>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>{this.props.user.TYPE} Login</ModalTitle>
            <Button bsStyle='warning' onClick={this.handleSkipAuth}>Dev Skip</Button>
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

LoginModal.propTypes = {
  onAuthenticate: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default LoginModal
