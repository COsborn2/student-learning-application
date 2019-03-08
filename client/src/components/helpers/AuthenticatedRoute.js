import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import StudentView from '../students/StudentView'

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const type = Component === StudentView ? 'student' : 'instructor'
  const user = JSON.parse(window.sessionStorage.getItem(type))
  return (user) ? <Route {...rest} render={props => <Component {...props} user={user} />} />
    : <Redirect to={`/login/${type}`} />
}
AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
}

export default AuthenticatedRoute
