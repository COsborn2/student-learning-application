/* eslint-env jest */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div')
<<<<<<< HEAD
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>, div)
=======
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
>>>>>>> fix-dependencies
})
