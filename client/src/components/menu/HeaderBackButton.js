import React from 'react'
import { Button } from 'react-bootstrap'

const HeaderBackButton = props => (
  <header className='navbar'>
    <Button bsStyle='link' style={{ borderRadius: 50, background: '#5a6268' }}
      onClick={() => props.history.go(-1)}>back </Button>
  </header>
)

export default HeaderBackButton
