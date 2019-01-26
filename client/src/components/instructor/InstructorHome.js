import React from 'react'

const InstructorHome = (props) => (
  <div className='container text-center'>
    <header className='jumbotron my-3 bg-info'>
      <h1 className='display-4 font-weight-bold'>Instructor {props.match.params.id}</h1>
    </header>
  </div>

)

export default InstructorHome
