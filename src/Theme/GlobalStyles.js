import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', Inter, system-ui, sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  *:focus-visible {
    outline: 1px solid #10B981 !important;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.15) !important;
  }

  .chakra-ui-dark {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .chakra-ui-light {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .forecast img {
    display: block;
    margin: 1rem 0;
    width: 100%;
    border-radius: 2px;
  }

  .forecast-day {
    margin: 1rem 0;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.4);
    border-radius: 0;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.7);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`

export default GlobalStyle
