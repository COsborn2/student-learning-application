import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'

import App from './App'
import registerServiceWorker from './registerServiceWorker'
import HomeScreen from './components/HomeScreen/HomeScreen'

ReactDOM.render(<HomeScreen />, document.getElementById('root'))
registerServiceWorker()
