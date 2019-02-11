import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import InstructorHome from './InstructorHome'
import InstructorObj from '../../javascript/InstructorObj'

/* The instructor view manages all screens and routes for a specific instructor user
 the login screen creates and authenticates an instructor object, and passes it
 to this component. If the user object ever becomes null or not authentic, it redirects
 to the login screen */

class InstructorView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: new InstructorObj(this.props.history.location.state)
    }
    if (!this.state.user) {
      console.error('InstructorView ctor error: user is null')
    }
  }

  componentDidMount () {
    let user = this.state.user
    if (user && user.isAuth) { // makes sure api isn't called if user is not valid
      let succeeded = user.updateClasses()
      if (succeeded) { this.setState({ user }) }
    }
  }

  render () {
    let user = this.state.user
    if (!user || !user.isAuth) {
      return <Redirect to='/login/instructor' />
    }
    return (
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route exact path='/instructor/:id' component={InstructorHome} />
        </Switch>
      </div>
    )
  }
}

InstructorView.propTypes = {
  match: PropTypes.object.isRequired
}

export default InstructorView
