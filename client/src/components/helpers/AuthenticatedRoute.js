import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'

const AuthenticatedRoute = ({ component: Component, render: Render, path, props }) => {
  const type = path.substring(1)
  const user = JSON.parse(window.sessionStorage.getItem(type))
  if (!Render && !Component) {
    console.error(`Invalid props, \`component\` or \`render\` props expected, but their value is undefined. \npath: ${path}`)
    return <Redirect to={'/'} />
  }

  if (!user) return <Redirect to={`/login/${type}`} />
  if (Render) return <Route {...props} render={Render} />
  if (Component) return <Route {...props} render={props => <Component {...props} user={user} />} />
}

AuthenticatedRoute.propTypes = {
  component: PropTypes.func,
  render: PropTypes.func,
  path: PropTypes.string.isRequired
}

export default AuthenticatedRoute
