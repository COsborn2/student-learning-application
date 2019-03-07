import React from 'react'
import PropTypes from 'prop-types'
import LoadingScreenGif from './LoadingScreenGif'
import '../../assets/css/HelperStyles.css'

function LoadingScreen (props) {
  let loadingStyle = 'img-fluid position-absolute m-auto '
  if (props.triggerFadeAway) {
    loadingStyle += 'fade-away'
    setTimeout(() => {
      props.onStopped()
    }, 500)
  }
  return (
    <LoadingScreenGif className={loadingStyle} />
  )
}

LoadingScreen.propTypes = {
  triggerFadeAway: PropTypes.bool.isRequired,
  onStopped: PropTypes.func.isRequired
}

export default LoadingScreen
