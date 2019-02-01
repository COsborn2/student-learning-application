import React from 'react'
import PropTypes from 'prop-types'
import './ProgressStyles.css'

const Filler = props => {
  let percent = props.percentage >= 100 ? 100 : props.percentage * 100
  return <div className='filler-cust' style={{ width: `${percent}%` }} />
}

const ProgressBar = props => {
  return (
    <div className={'progress-bar-cust'} >
      <Filler percentage={props.percentage} />
    </div>
  )
}

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired
}
Filler.propTypes = {
  percentage: PropTypes.number.isRequired
}

export default ProgressBar
