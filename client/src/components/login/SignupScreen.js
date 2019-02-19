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
import InstructorApiCalls from '../../javascript/InstructorApiCalls'
import StudentApiCalls from '../../javascript/StudentApiCalls'

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

class SignupScreen extends Component {
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
    this.handleSignup = this.handleSignup.bind(this)
  }

  async handleSignup () {
    let { api, type } = this.state
    const password = this._passwordInput.value
    const id = this._idInput.value

    if (id === '') {
      this.animateMessage('* A username is required')
    } else if (password === '') {
      this.animateMessage('* A password is required')
    }

    let res = await api.verifySignup(id, password)

    if (res.error) this.animateMessage(res.error)
    else if (!res.jwt) this.animateMessage('* Invalid username or password')
    else this.props.history.replace(`/${type}/${id}`, { id, jwt: res.jwt }) // navigates to the proper user screen, passing the jwt
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
            <Button type={'submit'} onClick={this.handleSignup}>Sign Up</Button>
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
