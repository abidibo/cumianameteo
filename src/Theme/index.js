import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Abel', sans-serif`,
    body: `'Abel', sans-serif`,
  },
})

export default theme
