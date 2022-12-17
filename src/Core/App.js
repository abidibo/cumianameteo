import { identity, ifElse } from 'ramda'
import React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import Logger from '@Common/Utils/Logger'
import GlobalStyles from '@Theme/GlobalStyles'

import AppRouter from './Router'
import StartupView from './Views/StartupView'
import Toast from '@Common/Components/Toast'
import theme from '@Theme'
import '@fontsource/abel/400.css'


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

  return (
    <ChakraProvider theme={theme}>
      <GlobalStyles />
      <AppContent />
      <Toast />
    </ChakraProvider>
  )
}

export default App
