import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Bebas Neue', sans-serif`,
    body: `'DM Sans', Inter, system-ui, sans-serif`,
    mono: `'Share Tech Mono', 'SF Mono', Consolas, monospace`,
  },
  styles: {
    global: (props) => ({
      body: {
        background:
          props.colorMode === 'dark'
            ? 'radial-gradient(circle, rgba(16,185,129,0.06) 1px, transparent 1px) #080c14'
            : 'radial-gradient(circle, rgba(14,116,144,0.08) 1px, transparent 1px) #E2ECF1',
        backgroundSize: '24px 24px',
        minHeight: '100vh',
      },
    }),
  },
})

export default theme
