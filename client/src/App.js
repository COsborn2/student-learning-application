import React, { Component } from 'react'
import './App.css'
import fetch from 'isomorphic-fetch'
import MainContent from './components/MainContent'
import { BrowserRouter as Browser } from 'react-router-dom'

class App extends Component {
  state = { words: [] }

  componentDidMount () {
    fetch('/api/getData')
      .then(res => res.json())
      .then(words => this.setState({ words }))
  }

  render () {
    return (
      <Browser>
        <div>
          <MainContent />
          <div className='App'>
            <h1>Words</h1>
            {this.state.words.map(curWord =>
              <div key={curWord.id}>{curWord.word}</div>
            )}
          </div>
        </div>
      </Browser>
    )
  }
}

export default App
