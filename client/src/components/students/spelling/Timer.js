import React from 'react'
import PropTypes from 'prop-types'

class Timer extends React.Component
{
    constructor (props) 
    {
        super(props)
        var time = new Date()
        this.state = {       
            startTime: time.getTime(),
            endTime: props.time,
            checkPoints: []
        }
    }
    
    setEndTime = () => {
        var time = new Date().getTime()
        this.setState({endTime: time})
    }

    render()
    {
        return (
          <div>
            {this.state.endTime - this.state.startTime}
          </div>
        )
    }
}

Timer.propTypes = {
}

export default Timer