import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/LoadingStyles.css'
import LoadingGif from '../../assets/images/LoadingScreenGif.gif'

const centerStyle = { top: 0, bottom: 0, left: 0, right: 0 }

function LoadingScreen (props) {
  let loadingStyle = 'img-fluid position-absolute m-auto '

  if (props.triggerFadeAway) {
    loadingStyle += 'fade-out'
    setTimeout(() => {
      props.onStopped()
    }, 500)
  }
  return <img className={loadingStyle} src={LoadingGif} alt='Loading' style={centerStyle} />
}

LoadingScreen.propTypes = {
  triggerFadeAway: PropTypes.bool.isRequired,
  onStopped: PropTypes.func.isRequired
}

export default LoadingScreen
