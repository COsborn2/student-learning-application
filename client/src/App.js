import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import fetch from 'isomorphic-fetch'

class App extends Component {
  state = { users: [] }

  componentDidMount () {
    fetch('/api/getData')
      .then(res => res.json())
      .then(users => this.setState({ users }))
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
        <p>{this.state.response}</p>
        <div className='App'>
          <h1>Users</h1>
          {this.state.users.map(user =>
            <div key={user.id}>{user.username}</div>
          )}
        </div>
      </div>
    )
  }
}

export default App
