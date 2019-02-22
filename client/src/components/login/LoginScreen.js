import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalTitle from 'react-bootstrap/ModalTitle'
import Form from 'react-bootstrap/Form'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'
import Button from 'react-bootstrap/Button'
import StudentApiCalls from '../../javascript/StudentApiCalls.js'
import InstructorApiCalls from '../../javascript/InstructorApiCalls.js'
import Col from 'react-bootstrap/Col'

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

const userTypeInfo = {
  instructor: {
    userType: 'Instructor',
    idType: 'email',
    passType: 'password',
    idTypeName: 'Email',
    passTypeName: 'Password',
    idSkip: 'instructorDev@test.com',
    hasSignUp: true
  },
  student: {
    userType: 'Student',
    idType: 'text',
    passType: 'text',
    idTypeName: 'Course Id',
    passTypeName: 'Username',
    idSkip: 'studentDev',
    hasSignUp: false
  }
}

class LoginScreen extends Component {
  constructor (props) {
    super(props)
    let type = this.props.match.params.type
    let api = null
    let typeInfo = null
    if (type === 'instructor') {
      api = InstructorApiCalls
      typeInfo = userTypeInfo.instructor
    } else {
      api = StudentApiCalls
      typeInfo = userTypeInfo.student
    }
    this.state = {
      failedMessage: '',
      showMessage: false,
      typeInfo: typeInfo,
      type: type,
      api: api
    }
    // this.handleVerifyAuth = this.handleVerifyAuth.bind(this)
    this.handleSkipAuth = this.handleSkipAuth.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
  }

  // Hit backend for verification
  async handleVerifyAuth (event) {
    const form = event.currentTarget
    if (form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }

    let { api, type } = this.state
    const password = form.elements.passField.value
    const id = form.elements.idField.value

    let res = await api.verifyAuth(id, password)
    if (res.error) {
      console.log(res.error)
      this.animateMessage(res.error)
    } else if (!res.jwt) this.animateMessage('* Incorrect username or password')
    else this.props.history.replace(`/${type}/${id}`, { id, jwt: res.jwt }) // navigates to the proper user screen, passing the jwt
  }

  handleSkipAuth () {
    let { type, typeInfo } = this.state
    let id = typeInfo.idSkip
    this.props.history.replace(`/${type}/${id}`, { id, jwt: 'ValidJWT' }) // todo remove dev skip for easy access
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
    let { typeInfo } = this.state
    let errorMessageStyle = this.state.showMessage ? messageStyles.messageShow : messageStyles.messageFading
    let signUpBtn = typeInfo.hasSignUp ? <Button onClick={this.handleSignup}>Signup</Button> : ''
    return (
      <React.Fragment>
        <Form onSubmit={e => this.handleVerifyAuth(e)}>
          <ModalDialog>
            <ModalHeader>
              <ModalTitle>{typeInfo.userType} Login</ModalTitle>
              <div className='flex-fill' />
              <Button className='btn-warning mx-2' onClick={this.handleSkipAuth}>Dev Skip</Button>
              {signUpBtn}
            </ModalHeader>

            <ModalBody>
              <Form.Group as={Col}>
                <Form.Label>{ typeInfo.idTypeName }</Form.Label>
                <Form.Control
                  required
                  name='idField'
                  type={typeInfo.idType}
                  placeholder={typeInfo.idTypeName} />
                <Form.Control.Feedback type='invalid'>
                  Please provide a valid {typeInfo.idTypeName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>{ typeInfo.passTypeName }</Form.Label>
                <Form.Control
                  required
                  name='passField'
                  type={typeInfo.passType}
                  placeholder={typeInfo.passTypeName} />
                <Form.Control.Feedback type='invalid'>
                  Please provide a valid {typeInfo.passTypeName}
                </Form.Control.Feedback>
              </Form.Group>

            </ModalBody>

            <ModalFooter>
              <p style={errorMessageStyle}>{this.state.failedMessage}</p>
              <div className='flex-fill' />
              <Button onClick={() => this.props.history.push('/')}>Close</Button>
              <Button type='submit'>Log in</Button>
            </ModalFooter>
          </ModalDialog>
        </Form>

      </React.Fragment>
    )
  }
}

LoginScreen.propTypes = {
  history: PropTypes.object.isRequired
}

export default LoginScreen
