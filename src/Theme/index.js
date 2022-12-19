import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// const breakpoints = {
//   sm: '30em',
//   md: '48em',
//   lg: '62em',
//   xl: '80em',
//   '2xl': '96em',
// }

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Abel', sans-serif`,
    body: `'Abel', sans-serif`,
  },
})

export default theme
