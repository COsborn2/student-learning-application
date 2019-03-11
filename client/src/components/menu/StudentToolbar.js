import React, { PureComponent } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

function onSignoutBtnHandler () {
  window.sessionStorage.clear()
}

function onMenuBtnHandler () {
  window.alert('IDK what this would do')
}

class StudentToolbar extends PureComponent {
  render () {
    return (
      <header className='mx-auto text-center' style={{ width: '85%' }}>
        <Navbar style={{ background: 'rgba(155, 176, 204, 0.62)' }}>
          <Nav className='mr-auto'>
            <Navbar.Brand href='\'>Home</Navbar.Brand>
          </Nav>
          <Nav>
            <NavDropdown title='&#9776;'>
              <NavDropdown.Item onClick={onMenuBtnHandler}>Menu</NavDropdown.Item>
              <NavDropdown.Item href='/' onClick={onSignoutBtnHandler}>Sign out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav />
        </Navbar>
      </header>
    )
  }
}

export default StudentToolbar
