import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Course from './Course'
import Button from 'react-bootstrap/es/Button'
import './instructorStyles.css'

class InstructorHome extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: this.props.match.params.userId,
      courses: this.props.courses,
      selectedCourse: -1
    }
    this.onCourseClick = this.onCourseClick.bind(this)
    console.log('path: ' + this.props.match.path)
  }

  //what if it want using Router at all an instead just used state to manage the rendered class

  onCourseClick (index) {
    let { selectedCourse } = this.state
    console.log('courseClicked: ' + index)
    console.log('prevSelected: ' + selectedCourse)
    if( index === selectedCourse) {
      selectedCourse = -1
    }
    else {
      selectedCourse = index
    }
    this.setState({ selectedCourse })
  }

  createCourseComponents () {
    return (
      <div>
        {this.props.courses.map((course, index) =>
          <div key={index}>
            <Button onClick={() => this.onCourseClick(index)} className='test btn-lg btn-primary rounded-pill'>{course.className}</Button>
            <Course {...this.props} show={index === this.state.selectedCourse} course={course} />
            <hr />
          </div>
        )}
      </div>
    )
  }

  render () {
    return (
      <div className='container text-center'>
        <header className='jumbotron my-3 bg-info'>
          <h1 className='display-4 font-weight-bold'> Hello {this.state.userId}</h1>
        </header>
        {this.createCourseComponents()}
      </div>
    )
  }
}

InstructorHome.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired
}

export default InstructorHome
