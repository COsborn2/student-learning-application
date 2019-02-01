import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ProgressBar from './ProgressBar'

class TimerBar extends PureComponent {
  constructor (props) {
    super(props)
    let startTime = props.isIncreasing ? 0 : props.totalTime
    let startPercent = props.isIncreasing ? 0 : 1
    this.state = {
      timeTotal: props.totalTime,
      timeCur: startTime,
      delta: props.delta,
      percentage: startPercent,
      isIncreasing: props.isIncreasing,
      isFinished: false
    }
  }

  updateDelta () {
    let { timeTotal, timeCur, delta, percentage, isIncreasing, isFinished } = this.state
    timeCur += isIncreasing ? delta : -delta
    percentage = (timeTotal === 0) ? 0 : timeCur / timeTotal
    isFinished = timeCur <= 0 || timeCur >= timeTotal
    setTimeout(() => { this.setState({ timeCur, percentage, isFinished }) }, this.state.delta * 1000)
  }

  render () {
    if (!this.state.isFinished) { this.updateDelta() }

    return (
      <div>
        <ProgressBar percentage={this.state.percentage} />
      </div>
    )
  }
}

TimerBar.propTypes = {
  totalTime: PropTypes.number.isRequired,
  delta: PropTypes.number,
  initialTime: PropTypes.number,
  isIncreasing: PropTypes.bool
}

export default TimerBar
