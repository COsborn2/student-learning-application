import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { ButtonGroup } from 'react-bootstrap'

class EditStudent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      validated: false
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  /**
   * This is called when the submit button is clicked
   * @param event The onSubmit event created by the form
   */
  onSubmit (event) {
    const form = event.currentTarget
    event.preventDefault()
    this.setState({ validated: true })
    if (form.checkValidity() === false) {
      event.stopPropagation()
      return
    }

    const username = form.elements.userNameField.value
    const password = form.elements.passwordField.value

    this.props.onEditSubmit(username, password)
  }

  render () {
    const { validated } = this.state
    return (
      <Form noValidate validated={validated} className='m-2' onSubmit={e => this.onSubmit(e)} >
        <Form.Label>Edit {this.props.student.username}</Form.Label>
        <Form.Group as={Col}>
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            name='userNameField'
            type='text'
            defaultValue={this.props.student.username} />
          <Form.Control.Feedback type='invalid'> Please provide a username</Form.Control.Feedback>

          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            name='passwordField'
            type='password'
            defaultValue='*******' />
          <Form.Control.Feedback type='invalid'> Please provide a password</Form.Control.Feedback>

          <ButtonGroup>
            <Button className='m-1' onClick={() => this.props.onEditCancel()}>Cancel</Button>
            <Button className='m-1' type='submit'>Submit</Button>
          </ButtonGroup>
        </Form.Group>
      </Form>
    )
  }
}

EditStudent.propTypes = {
  student: PropTypes.object.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  onEditCancel: PropTypes.func.isRequired
}

export default EditStudent
