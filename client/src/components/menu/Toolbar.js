import React, { PureComponent } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import StudentApiCalls from '../../javascript/StudentApiCalls'

function onSignoutBtnHandler () {
  window.sessionStorage.clear()
}

function onMenuBtnHandler () {
  window.alert('IDK what this would do')
}

async function resetStudentProgress () {
  const user = JSON.parse(window.sessionStorage.getItem('student'))
  window.sessionStorage.clear()
  await StudentApiCalls.devSetStudentProgress(user.jwt, 0, 0, 0)
}

class Toolbar extends PureComponent {
  render () {
    return (
      <header className='mx-auto align-middle' style={{ width: '90%', paddingTop: '0', marginTop: '0', marginBottom: '0' }}>
        <Navbar style={{ background: '#7eaec5', height: '11vh', minHeight: '80px' }}>
          <Nav className='mr-auto' style={{ paddingRight: '0', marginRight: '0' }}>
            <Navbar.Brand href='\' style={{ color: 'white', fontSize: '400%' }}>Home</Navbar.Brand>
          </Nav>
          <Nav>
            <NavDropdown title='&#9776;' style={{ fontSize: '300%' }}>
              <NavDropdown.Item onClick={onMenuBtnHandler}>Menu</NavDropdown.Item>
              <NavDropdown.Item href='/' onClick={onSignoutBtnHandler}>Sign out</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href='/' onClick={resetStudentProgress}>Reset progress</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      </header>
    )
  }
}

export default Toolbar
