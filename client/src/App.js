import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import fetch from 'isomorphic-fetch'

class App extends Component {
  state = { words: [] }

  componentDidMount () {
    fetch('/api/getData')
      .then(res => res.json())
      .then(words => this.setState({ words }))
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
          <h1>Words</h1>
          {this.state.words.map(curWord =>
            <div key={curWord.id}>{curWord.word}</div>
          )}
        </div>
      </div>
    )
  }
}

export default App
