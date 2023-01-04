import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Antic;
  }
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .forecast img {
    display: block;
    margin: 1rem 0;
    width: 100%;
  }

  .forecast-day {
    margin: 1rem 0;
  }
`

export default GlobalStyle
