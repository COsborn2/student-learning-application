import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'

/**
 * This component handles the redirection to login if the web token becomes invalid
 * @param Component The component to render
 * @param LazyComponent The lazy loaded component to render
 * @param path The path of which to render the component
 * @param props Any additional props to pass to the route
 * @returns {*} The route to the component or a redirect to the login screen
 */
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
