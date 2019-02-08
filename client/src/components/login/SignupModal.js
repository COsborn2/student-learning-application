import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SignupModal extends Component {
  render () {
    return (
      <div className='modal-dialog-centered'>
        <ModalDialog>
          <ModalHeader>
            <ModalTitle>{this.props.user.TYPE} Login</ModalTitle>
            <Button bsStyle='warning' onClick={this.handleSkipAuth}>Dev Skip</Button>
          </ModalHeader>

          <ModalBody>
            <Form>
              <FormGroup>
                <ControlLabel>User Id</ControlLabel>
                <FormControl type='text'
                             placeholder='Id'
                             inputRef={(ref) => { this._idInput = ref }} />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl type='password'
                             placeholder='Password'
                             inputRef={(ref) => { this._passwordInput = ref }} />
              </FormGroup>
            </Form>

          </ModalBody>

          <ModalFooter>
            <p style={errorMessageStyle}>{this.state.failedMessage}</p>
            <div style={{ flex: 1 }} />
            <Button bsStyle='primary' onClick={() => this.props.history.push('/')}>Close</Button>
            <Button bsStyle='primary' type={'submit'} onClick={this.handleVerifyAuth}>Log in</Button>
          </ModalFooter>
        </ModalDialog>
      </div>
    )
  }
}

SignupModal.propTypes = {}

export default SignupModal
