import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import StudentView from '../students/StudentView'

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const jwt = window.sessionStorage.getItem('jwt')
  const type = Component === StudentView ? 'student' : 'instructor'
  return jwt ? <Route {...rest} render={props => <Component {...props} jwt={jwt} />} />
    : <Redirect to={`/login/${type}`} />
}
AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
}

export default AuthenticatedRoute
