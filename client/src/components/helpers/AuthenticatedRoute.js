import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'

const AuthenticatedRoute = ({ component: Component, lazyComponent: LazyComponent, path, props }) => {
  const type = path.substring(1)
  const user = JSON.parse(window.sessionStorage.getItem(type))
  if (!LazyComponent && !Component) {
    console.error(`Invalid props, \`component\` or \`LazyComponent\` props expected, but their value is undefined. \npath: ${path}`)
    return <Redirect to={'/'} />
  }

  if (!user) return <Redirect to={`/login/${type}`} />
  if (LazyComponent) return <Route {...props} render={(props) => <LazyComponent {...props} user={user} />} />
  if (Component) return <Route {...props} render={props => <Component {...props} user={user} />} />
}

AuthenticatedRoute.propTypes = {
  component: PropTypes.func,
  lazyComponent: PropTypes.object,
  path: PropTypes.string.isRequired
}

export default AuthenticatedRoute
