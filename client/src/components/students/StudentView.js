import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoginModal from '../login/LoginModal'
import StudentHome from './StudentHome'
import { Redirect, Route, Switch } from 'react-router-dom'
import StudentSpelling from './StudentSpelling'
import StudentWriting from './StudentWriting'
import StudentObj from '../../javascript/StudentObj'

class StudentView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: new StudentObj()
    }
  }

  render () {
    let { user } = this.state
    let { pathname } = this.props.history.location
    if (!user.isAuth && pathname !== '/student/login') {
      return <Redirect to='/student/login' />
    }
    return (
      <div style={{ background: '#a9a9a9' }}>
        <Switch>
          <Route path='/student/login' render={() => <LoginModal history={this.props.history} user={user} />} />
          <Route exact path='/student/:id' component={StudentHome} />
          <Route path='/student/:id/spelling' component={StudentSpelling} />
          <Route path='/student/:id/writing' component={StudentWriting} />
        </Switch>
      </div>
    )
  }
}

StudentView.propTypes = {
  history: PropTypes.object.isRequired
}

export default StudentView
