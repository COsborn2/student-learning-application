import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import '../../assets/css/instructorStyles.css'
import { FormGroup, InputGroup, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import LoadingOverlay from '../loading/LoadingOverlay'
import InstructorApiCalls from '../../javascript/InstructorApiCalls'

const styles = {
  course: {
    maxHeight: 0,
    visibility: 'hidden',
    transition: 'maxHeight .5s ease-out, visibility .5s'
  },
  courseExpanded: {
    maxHeight: '500px',
    visibility: 'visible',
    transition: 'maxHeight .5s ease-in, visibility .5s'
  }
}

class CreateCourse extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      validated: false,
      isLoading: false,
      errorMessage: ''
    }
    this.submitBtnHandler = this.submitBtnHandler.bind(this)
  }

  async submitBtnHandler (event) {
    const form = event.currentTarget
    event.preventDefault()
    this.setState({ validated: true })

    if (form.checkValidity() === false) {
      event.stopPropagation()
      return
    }

    const courseCode = form.elements.courseCodeField.value

    this.setState({ isLoading: true })
    const res = await InstructorApiCalls.createCourse(this.props.jwt, courseCode)
    this.setState({ isLoading: false })

    if (res.error) {
      this.setState({ errorMessage: res.error })
    }

    const updatedCourseIds = res.courseIds
    this.props.onCourseCreated(updatedCourseIds)
  }

  render () {
    const { validated, show, isLoading } = this.state
    let outerCss = show ? 'course expand ' : 'course '
    let innerCss = show ? 'course-content expand ' : 'course-content '
    return (
      <div>
        <LoadingOverlay show={isLoading} />
        <Button className='test btn-lg btn-primary rounded-pill' onClick={() => this.setState({ show: !this.state.show })}>New Course</Button>
        <div className={outerCss + `container badge-light rounded my-4 py-1`}>
          <Form className={innerCss} validated={validated} onSubmit={e => this.submitBtnHandler(e)}>
            <h1 className='text-center'>Create New Course</h1>
            <Form.Group as={Col}>
              <Form.Label>Course Code</Form.Label>
              <Form.Control
                required
                name='courseCodeField'
                type='text'
                placeholder='course code'
              />
              <Form.Control.Feedback type='invalid'>Please provide a valid course name with no spaces</Form.Control.Feedback>
            </Form.Group>

            <FormGroup className='text-right'>
              <Button type='submit'>Submit</Button>

            </FormGroup>

          </Form>
        </div>
        <hr />

      </div>
    )
  }
}

CreateCourse.propTypes = {
  jwt: PropTypes.string.isRequired,
  onCourseCreated: PropTypes.func.isRequired
}

export default CreateCourse
