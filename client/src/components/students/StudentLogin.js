import React, { Component } from 'react'
import { Button, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle, Row } from 'react-bootstrap'

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
    const { userId, password } = this.state

    if (userId === '') {
      this.animateMessage('A username is required')
    } else if (password === '') {
      this.animateMessage('A password is required')
    } else if (this.state.id === 'c' && this.state.password === 'p') {
      this.props.onAuthenticate()
    } else {
      this.animateMessage('The username or password is incorrect')
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
    this.props.onAuthenticate()// todo remove this for easy access
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
            <div className='col-1'>
              <div className='row'>
                <p>User ID</p>
                <input type='text' onChange={(event) => this.setState({ id: event.target.value })} />
              </div>
              <div className='row'>
                <p>Password</p>
                <input type='password' onChange={(event) => this.setState({ password: event.target.value })} />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <p style={errorMessageStyle}>{this.state.failedMessage}</p>
            <Button onClick={() => this.props.history.push('/')}>Close</Button>
            <Button bsStyle='primary' onClick={this.handleVerifyAuth}>Log in</Button>
            <Button bsStyle='primary' onClick={this.handleSkipAuth}>Dev Skip</Button>
          </ModalFooter>
        </ModalDialog>
      </div>
    )
  }
}

export default StudentLogin
