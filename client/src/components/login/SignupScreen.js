import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalTitle from 'react-bootstrap/ModalTitle'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ModalBody from 'react-bootstrap/ModalBody'
import FormGroup from 'react-bootstrap/FormGroup'
import ModalFooter from 'react-bootstrap/ModalFooter'
import { FormControl, FormLabel } from 'react-bootstrap'

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

class SignupScreen extends Component {
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
    this.setState({ user })
    if (isAuth) {
      this.props.history.replace('/' + user.TYPE + '/' + user.id, user) // navigates to the proper user screen, passing the authenticated user as a prop
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
      <React.Fragment>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>{type} Sign Up</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <Form>
              <FormGroup>
                <FormLabel>User Id</FormLabel>
                <FormControl type='text'
                  placeholder='Id'
                  ref={(ref) => { this._idInput = ref }} />
              </FormGroup>

              <FormGroup>
                <FormLabel>Password</FormLabel>
                <FormControl type='password'
                  placeholder='Password'
                  ref={(ref) => { this._passwordInput = ref }} />
              </FormGroup>
            </Form>

          </ModalBody>

          <ModalFooter>
            <p style={errorMessageStyle}>{this.state.failedMessage}</p>
            <div style={{ flex: 1 }} />
            <Button onClick={() => this.props.history.push('/')}>Close</Button>
            <Button bsStyle='primary' type={'submit'} onClick={this.handleSignup}>Sign Up</Button>
          </ModalFooter>
        </ModalDialog>
      </React.Fragment>
    )
  }
}

SignupScreen.propTypes = {
  history: PropTypes.object.isRequired
}

export default SignupScreen
