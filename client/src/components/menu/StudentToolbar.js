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
      <header className='mx-auto' style={{ width: '90%', paddingTop: '0', marginTop: '0', marginBottom: '0' }}>
        <Navbar style={{ background: '#7eaec5', height: '11vh', minHeight: '80px' }}>
          <Nav className='mr-auto'>
            <Navbar.Brand href='\' style={{ color: 'white', fontSize: '400%' }}>Home</Navbar.Brand>
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
