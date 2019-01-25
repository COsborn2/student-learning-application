import React, { Component } from 'react'
import { Button, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle, Row } from 'react-bootstrap'



class StudentLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      password: '',
      failedMessage: ''
    }

    this.handleVerifyAuthentication = this.handleVerifyAuthentication.bind(this)
  }

  // Hit backend for verification
  handleVerifyAuthentication () {
    const { userId, password } = this.state

    if (userId === '') {
      this.setState({ failedMessage: 'A username is required' })
    } else if (password === '') {
      this.setState({ failedMessage: 'A password is required' })
    } else if (this.state.id === 'c' && this.state.password === 'p') {
      this.props.onAuthenticate()
    } else {
      this.setState({ failedMessage: 'Incorrect password' })
    }
  }

  render (props) {
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
                <p>{this.state.id}</p>
              </div>
              <div className='row'>
                <p>Password</p>
                <input type='password' onChange={(event) => this.setState({ password: event.target.value })} />
                <p>{this.state.password}</p>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <p>{this.state.failedMessage}</p>
            <Button onClick={() => this.props.history.push('/')}>Close</Button>
            <Button bsStyle='primary' onClick={this.handleVerifyAuthentication}>Log in</Button>
          </ModalFooter>
        </ModalDialog>
      </div>
    )
  }
}

export default StudentLogin
