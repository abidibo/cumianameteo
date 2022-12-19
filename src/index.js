import React from 'react'
import ReactDOM from 'react-dom/client'
import { ColorModeScript } from '@chakra-ui/react'
import { Provider } from 'react-redux'

import Logger from '@Common/Utils/Logger'

import App from '@Core/App'
import { store } from './Core/Redux/Store'
import './i18n'
import theme from '@Theme'
import reportWebVitals from './reportWebVitals'

Logger.info('Initializing cumianameteo application')
Logger.info('Theme mode: ', theme.config.initialColorMode)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </Provider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
