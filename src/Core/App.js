import { identity, ifElse } from 'ramda'
import React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import Logger from '@Common/Utils/Logger'
import GlobalStyles from '@Theme/GlobalStyles'

import AppRouter from './Router'
import StartupView from './Views/StartupView'
import Toast from '@Common/Components/Toast'
import EventDispatcher from '@Common/Services/EventDispatcher'
import theme from '@Theme'
import '@fontsource/abel/400.css'
import i18n from 'i18n'
import dayjs from 'dayjs'
require('dayjs/locale/en')
require('dayjs/locale/it')
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)


const AppContent = () => {
  const [isComplete, setIsComplete] = React.useState(false)
  React.useEffect(() => {
    setTimeout(() => setIsComplete(true), 2000)
  }, [])

  return ifElse(
    identity,
    () => <AppRouter />,
    () => <StartupView />,
  )(isComplete)
}

function App() {
  Logger.info('Rendering App component')
  Logger.debug('Theme', theme)
  Logger.debug('I18n', i18n)

  dayjs.locale(i18n.language)
  EventDispatcher.register('localeChange', (_, locale) => {
    dayjs.locale(locale)
  })

  return (
    <ChakraProvider theme={theme}>
      <GlobalStyles />
      <AppContent />
      <Toast />
    </ChakraProvider>
  )
}

export default App
