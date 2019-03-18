import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/LoadingStyles.css'
import LoadingGif from '../../assets/images/LoadingScreenGif.gif'

const centerStyle = { top: 0, bottom: 0, left: 0, right: 0 }

/**
 * This function is a loading animation to be displayed while components are lazy loaded or initial api calls for student and instructor
 * @param props The props passed
 * @returns {*} The loading animation to render
 */
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
  triggerFadeAway: PropTypes.bool,
  onStopped: PropTypes.func
}

export default LoadingScreen
