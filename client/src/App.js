import React, { Component } from 'react'
import './App.css'
import fetch from 'isomorphic-fetch'
import Main from './components/Main'

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
        <Main />

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
