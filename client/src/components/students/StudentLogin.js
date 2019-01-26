import React, { Component } from 'react'
import { Button, Row, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'

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

class StudentLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      password: '',
      failedMessage: '',
      showMessage: false
    }

    this.handleVerifyAuth = this.handleVerifyAuth.bind(this)
    this.handleSkipAuth = this.handleSkipAuth.bind(this)
  }

  // Hit backend for verification
  handleVerifyAuth () {
    const { id, password } = this.state

    if (id === '') {
      this.animateMessage('A username is required')
    } else if (password === '') {
      this.animateMessage('A password is required')
    } else if (this.state.id === 'dev' && this.state.password === 'password') {
      this.props.onAuthenticate()
    } else {
      this.animateMessage('incorrect username or password')
    }
  }

  animateMessage (msg) {
    this.setState({ failedMessage: msg })
    this.setState({ showMessage: true })

    setTimeout(() => {
      this.setState({ showMessage: false })
    }, 500)
  }

  handleSkipAuth () {
    this.props.history.push('/student/home')
    this.props.onAuthenticate()// todo remove dev skip for easy access
  }

  render () {
    let errorMessageStyle = this.state.showMessage ? messageStyles.messageShow : messageStyles.messageFading
    return (
      <div className='modal-backdrop'>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>Student Login</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <p>User ID</p>
            <input type='text' onChange={(event) => this.setState({ id: event.target.value })} />
            <p>Password</p>
            <input type='password' onChange={(event) => this.setState({ password: event.target.value })} />
          </ModalBody>

          <ModalFooter>
            <p style={errorMessageStyle}>{this.state.failedMessage}</p>
            <Button bsStyle='primary' onClick={() => this.props.history.push('/')}>Close</Button>
            <Button bsStyle='primary' onClick={this.handleVerifyAuth}>Log in</Button>
            <Button bsStyle='warning' onClick={this.handleSkipAuth}>Dev Skip</Button>
          </ModalFooter>
        </ModalDialog>
      </div>
    )
  }
}

export default StudentLogin
