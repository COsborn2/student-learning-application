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

class SignupModal extends Component {
  constructor (props) {
    super(props)
    let type = this.props.match.params.type
    let user = type === 'instructor' ? new InstructorObj() : new StudentObj()
    this.state = {
      failedMessage: '',
      showMessage: false,
      user: user
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
      this.props.history.replace('/')
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
