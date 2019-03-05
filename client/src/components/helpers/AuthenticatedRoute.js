import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import StudentView from '../students/StudentView'

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const type = Component === StudentView ? 'student' : 'instructor'
  const jwt = window.sessionStorage.getItem(`${type}jwt`)
  const id = window.sessionStorage.getItem(`${type}id`)
  return jwt ? <Route {...rest} render={props => <Component {...props} id={id} jwt={jwt} />} />
    : <Redirect to={`/login/${type}`} />
}
AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
}

export default AuthenticatedRoute
