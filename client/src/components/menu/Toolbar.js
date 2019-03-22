import React, { PureComponent } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

/**
 * This is a tool bar that contains a home button as well as a
 * Signout button. Is intended for both Instructor and Student views.
 */
class Toolbar extends PureComponent {
  /**
   * This is called when the signout button is pressed
   */
  onSignoutBtnHandler () {
    window.sessionStorage.clear()
  }

  render () {
    return (
      <header className='mx-auto align-middle' style={{ width: '90%' }}>
        <Navbar style={{ background: '#7eaec5' }}>
          <Nav className='mr-auto'>
            <Navbar.Brand href='\' style={{ color: 'white', fontSize: '250%' }}>Home</Navbar.Brand>
          </Nav>
          <Nav style={{ fontSize: '150%' }}>
            <NavDropdown alignRight title='&#9776;' >
              <NavDropdown.Item href='/' onClick={this.onSignoutBtnHandler}>Sign out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      </header>
    )
  }
}

export default Toolbar
