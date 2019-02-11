import React, { Component } from 'react'

class InstructorHome extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render () {
    return (
      <div className='container text-center'>
        <header className='jumbotron my-3 bg-info'>
          <h1 className='display-4 font-weight-bold'>Instructor {this.props.match.params.id}</h1>
        </header>
      </div>
    )
  }
}

export default InstructorHome
