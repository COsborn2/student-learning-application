import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import InstructorHome from './InstructorHome'
import LoginModal from '../login/LoginModal'
import InstructorObj from '../../javascript/InstructorObj'

class InstructorView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: new InstructorObj()
    }
  }


  render () {
    let { user } = this.state
    let { pathname } = this.props.history.location
    if (!user.isAuth && pathname !== '/instructor/login') {
      return <Redirect to='/instructor/login' />
    }
    return (
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route path='/instructor/login' render={() => <LoginModal history={this.props.history} user={user} />} />
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
