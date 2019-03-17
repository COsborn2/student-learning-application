import React from 'react'
import PropTypes from 'prop-types'
import Spinner from '../../assets/images/Spinner.gif'

/**
 * This function is a loading animation that can be displayed
 * @returns {*} The loading animation to render
 */
function LoadingSpinner (props) {
  let loadingStyle = ''
  if (props.triggerFadeAway) {
    loadingStyle = 'loading-img-finish'
    setTimeout(() => {
      props.onStopped()
    }, 500)
  } else { loadingStyle = 'loading-img' }

  return (
    <img className={loadingStyle}
      src={Spinner}
      alt='Loading' />)
}

LoadingSpinner.propTypes = {
  triggerFadeAway: PropTypes.bool.isRequired,
  onStopped: PropTypes.func.isRequired
}

export default LoadingSpinner
