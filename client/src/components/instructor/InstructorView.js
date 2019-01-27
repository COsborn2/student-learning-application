import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import InstructorHome from './InstructorHome'
import LoginModal from '../login/LoginModal'

class InstructorView extends Component {
  constructor (props) {
    super(props)
    this.state = { userId: '', isAuthenticated: false }
  }

  onAuthenticated (userId) {
    this.setState({ userId: userId, isAuthenticated: true })
    this.props.history.replace('/instructor/' + userId)
  }

  render () {
    let { isAuthenticated } = this.state
    let { pathname } = this.props.history.location
    if (!isAuthenticated && pathname !== '/instructor/login') {
      return <Redirect to='/instructor/login' />
    }
    return (
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route path='/instructor/login' render={() => <LoginModal {...this.props} userType='Instructor' onAuthenticate={(id) => this.onAuthenticated(id)} />} />
          <Route exact path='/instructor/:id' component={InstructorHome} />
        </Switch>
      </div>
    )
  }
}

InstructorView.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default InstructorView
