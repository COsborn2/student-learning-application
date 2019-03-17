import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import '../../assets/css/instructorStyles.css'
import { FormGroup, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import LoadingOverlay from '../loading/LoadingOverlay'
import ExpandingSection from '../helpers/ExpandingSection'

const MessageStyles = {
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

/**
 * This component is used to create a new course
 */
class CreateCourse extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      validated: false,
      isLoading: false,
      errorMessage: null,
      errorMessageStyle: MessageStyles.messageShow
    }
    this.submitBtnHandler = this.submitBtnHandler.bind(this)
  }

  /**
   * This is called right before the component gets mounted to the dom
   */
  componentWillMount () { this._isMounted = true }

  /**
   * This is called right before the component gets unmounted to the dom
   */
  componentWillUnmount () { this._isMounted = false }

  /**
   * This method is called when the submit button is pressed
   * @param event The onSubmit event created by the form
   * @returns {Promise<void>}
   */
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
    const res = await this.props.createCourse(courseCode)
    this.setState({ isLoading: false })

    if (res.error) {
      this.setState({ errorMessage: res.error, errorMessageStyle: MessageStyles.messageShow })
      setTimeout(() => {
        if (this._isMounted) { this.setState({ errorMessageStyle: MessageStyles.messageFading }) }
      }, 3000)
    } else {
      this.setState({ show: false, validated: false })
      form.elements.courseCodeField.value = ''
    }
  }

  render () {
    const { validated, show, isLoading, errorMessage, errorMessageStyle } = this.state
    return (
      <div>
        <LoadingOverlay show={isLoading} />
        <Button className='test btn-lg btn-primary rounded-pill' onClick={() => this.setState({ show: !this.state.show })}>New Course</Button>
        <ExpandingSection show={show} className='badge-light'>

          <Form validated={validated} onSubmit={e => this.submitBtnHandler(e)}>
            <h1 className='text-center'>Create New Course</h1>
            <Form.Group as={Col}>
              <Form.Label>Course Code</Form.Label>
              <Form.Control
                required
                name='courseCodeField'
                type='text'
                placeholder='course code' />
              <Form.Control.Feedback type='invalid'>Please provide a valid course name with no spaces</Form.Control.Feedback>
            </Form.Group>

            <FormGroup className='text-right px-4' as={Row}>
              <p style={errorMessageStyle}>{errorMessage}</p>
              <div className='flex-fill' />
              <Button type='submit'>Submit</Button>
            </FormGroup>
          </Form>
        </ExpandingSection>
        <hr />
      </div>
    )
  }
}

CreateCourse.propTypes = {
  createCourse: PropTypes.func.isRequired
}

export default CreateCourse
