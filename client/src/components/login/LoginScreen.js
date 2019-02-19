import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalTitle from 'react-bootstrap/ModalTitle'
import Form from 'react-bootstrap/Form'
import ModalBody from 'react-bootstrap/ModalBody'
import FormGroup from 'react-bootstrap/FormGroup'
import ModalFooter from 'react-bootstrap/ModalFooter'
import Button from 'react-bootstrap/Button'
import { FormControl, FormLabel } from 'react-bootstrap'
import StudentApiCalls from '../../javascript/StudentApiCalls.js'
import InstructorApiCalls from '../../javascript/InstructorApiCalls.js'

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

class LoginScreen extends Component {
  constructor (props) {
    super(props)
    let type = this.props.match.params.type
    let api = type === 'instructor' ? InstructorApiCalls : StudentApiCalls
    this.state = {
      failedMessage: '',
      showMessage: false,
      type: type,
      api: api
    }
    this.handleVerifyAuth = this.handleVerifyAuth.bind(this)
    this.handleSkipAuth = this.handleSkipAuth.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
  }

  // Hit backend for verification
  async handleVerifyAuth () {
    let { api, type } = this.state
    const password = this._passwordInput.value
    const id = this._idInput.value

    if (id === '') {
      this.animateMessage('* A username is required')
    } else if (password === '') {
      this.animateMessage('* A password is required')
    }

    let res = await api.verifyAuth(id, password)
    if (res.error) this.animateMessage(res.error)
    else if (!res.jwt) this.animateMessage('* Incorrect username or password')
    else this.props.history.replace(`/${type}/${id}`, { id, jwt: res.jwt }) // navigates to the proper user screen, passing the jwt
  }

  handleSkipAuth () {
    let { api, type } = this.state
    let id = `${type}Dev`
    let jwt = api.verifyAuth(`${type}Dev`, 'password')
    this.props.history.replace(`/${type}/${id}`, { id, jwt }) // todo remove dev skip for easy access
  }

  animateMessage (msg) {
    this.setState({ failedMessage: msg, showMessage: true })

    setTimeout(() => {
      this.setState({ showMessage: false })
    }, 1000)
  }

  handleSignup () {
    let type = this.state.type
    this.props.history.replace(`/signup/${type}`) // todo remove dev skip for easy access
  }

  render () {
    let errorMessageStyle = this.state.showMessage ? messageStyles.messageShow : messageStyles.messageFading
    let type = this.state.type.charAt(0).toLocaleUpperCase() + this.state.type.slice(1)
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
