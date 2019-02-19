import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InstructorObj from '../../javascript/InstructorObj'
import StudentObj from '../../javascript/StudentObj'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalTitle from 'react-bootstrap/ModalTitle'
import Form from 'react-bootstrap/Form'
import ModalBody from 'react-bootstrap/ModalBody'
import FormGroup from 'react-bootstrap/FormGroup'
import ModalFooter from 'react-bootstrap/ModalFooter'
import FormLabel from 'react-bootstrap/es/FormLabel'
import FormControl from 'react-bootstrap/es/FormControl'
import Button from 'react-bootstrap/es/Button'

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
    let user = this.state.user

    if (id === '') {
      this.animateMessage('* A username is required')
    } else if (password === '') {
      this.animateMessage('* A password is required')
    }

    let isAuth = user.verifyAuth(id, password)
    this.setState({ user })
    if (isAuth) {
      this.props.history.replace('/' + user.TYPE + '/' + user.id, user) // navigates to the proper user screen, passing the authenticated user as a prop
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
    this.setState({ user })
    if (isAuth) {
      this.props.history.replace('/' + user.TYPE + '/' + user.id, user) // todo remove dev skip for easy access
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
      <React.Fragment>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>{type} Login</ModalTitle>
            <div className='flex-fill' />
            <Button className='btn-warning mx-2' onClick={this.handleSkipAuth}>Dev Skip</Button>
            <Button onClick={this.handleSignup}>Signup</Button>
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
            <div className='flex-fill' />
            <Button onClick={() => this.props.history.push('/')}>Close</Button>
            <Button type={'submit'} onClick={this.handleVerifyAuth}>Log in</Button>
          </ModalFooter>
        </ModalDialog>
      </React.Fragment>
    )
  }
}

LoginScreen.propTypes = {
  history: PropTypes.object.isRequired
}

export default LoginScreen
