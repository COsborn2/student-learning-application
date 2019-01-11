import React, { Component } from 'react'
import './App.css'
import MainContent from './components/MainContent'
import { BrowserRouter as Browser } from 'react-router-dom'

class App extends Component {
  render () {
    return (
      <Browser>
        <div>
          <MainContent />
        </div>
      </Browser>
    )
  }
}

export default App
