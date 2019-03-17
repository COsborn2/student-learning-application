import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import EditStudent from './EditStudent'
import HorizontalExpandingSection from '../helpers/HorizontalExpandingSection'
import ExpandingSection from '../helpers/ExpandingSection'

class StudentInfo extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      show: true,
      showEdit: false
    }
    this.onCloseStudent = this.onCloseStudent.bind(this)
    this.onEditStudent = this.onEditStudent.bind(this)
    this.onEditSubmit = this.onEditSubmit.bind(this)
    this.onDeleteStudent = this.onDeleteStudent.bind(this)
  }

  onCloseStudent () {
    this.setState({ show: false })
    this.props.onCloseStudent()
  }

  onEditStudent () {
    const shouldEdit = window.confirm(`Are you sure you want to edit ${this.props.student.username}?
If they will be logged out`)

    if (shouldEdit)
      this.setState({showEdit: true})
  }

  onEditSubmit (username) {
    window.alert(`The API does not support this operation yet.\nThe changes will only persist until the course ${this.props.student.classname} is closed`)
    this.setState({ showEdit: false })
  }

  onDeleteStudent () {
    const shouldDelete = window.confirm(`Are you sure you want to delete ${this.props.student.username}?
All of their progress will be deleted. This action cannot be undone`)

    if (shouldDelete) console.log('Deleted')
    else console.log('Not Deleted')
  }

  render () {
    const { show, showEdit } = this.state
    let studentInfoStyle = {}
    if (!show) studentInfoStyle = { height: this._childrenRef.clientHeight } // this constrains the height of the element when it is sliding closed

    console.log('showEdit: ' + showEdit)

    return (
      <div ref={ref => { this._childrenRef = ref }} style={studentInfoStyle} className='row'>
        <div className='col-1 m-1'>
          <Button className='badge-light p-1 text-center' style={{ width: '200%', height: '100%' }} onClick={() => this.onCloseStudent()}>
            ←
          </Button>
        </div>
        <div className='col text-left'>
          <div className='row mr-auto mt-1'>
            <div className='flex-fill' />
            <Button className='badge-info mr-2 fa' onClick={() => this.onEditStudent()} >&#xf044;</Button>
            <Button className='badge-danger mr-2 fa' onClick={() => this.onDeleteStudent()}>&#xf014;</Button>
          </div>
          Username: {this.props.student.username} <br />
          Current Assignment: {this.props.student.currentAssignment} <br />
          Current Letter: {this.props.student.currentLetter} <br />
        </div>
        <ExpandingSection show={showEdit}>
          <EditStudent onEditSubmit={(username) => this.onEditStudent(username)} onEditCancel={() => this.setState({ showEdit: false })} student={this.props.student} />
        </ExpandingSection>
      </div>
    )
  }
}

StudentInfo.propTypes = {
  student: PropTypes.object.isRequired,
  assignments: PropTypes.array.isRequired,
  onCloseStudent: PropTypes.func.isRequired
}

export default StudentInfo
