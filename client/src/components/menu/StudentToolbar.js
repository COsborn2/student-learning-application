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
              <NavDropdown.Divider />
              <NavDropdown.Item href='/' onClick={resetStudentProgress}>Reset progress</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav />
        </Navbar>
      </header>
    )
  }
}

export default StudentToolbar
