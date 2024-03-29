// import Sidebar from '@Common/Components/Sidebar'
import { Center, Grid, GridItem, Image, useColorMode } from '@chakra-ui/react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.main`
  max-width: 1980px;
  margin: auto;
`

import Logo from '@Assets/Images/abidibo.png'
import Navbar from '@Common/Components/Navbar'
import ComponentsTheme from '@Theme/Components'

/**
 * The base layout (almost) all views extend
 *
 * @param {Component} props.children - the main content
 * @param {Boolean} props.withFab - if the view contains a fab button, anm additional bottom padding is added
 */
const BaseLayout = ({ children }) => {
  const { colorMode } = useColorMode()

  return (
    <Grid
      minH="100vh"
      templateAreas={`"header"
                      "main"
                      "footer"`}
      gridTemplateRows={'60px 1fr 40px'}
      gridTemplateColumns={'1fr'}
      gap="0"
    >
      <GridItem area="header">
        <Navbar />
      </GridItem>
      <GridItem area="main" style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <Container size='xl'>
          {children}
        </Container>
      </GridItem>
      <GridItem
        bg={ComponentsTheme.footer.bg[colorMode]}
        area="footer"
        padding={0}
        alignItems="center"
        justifyContent={'center'}
        display="flex"
      >
        <Center margin={0}>
          Copyright 2022-{new Date().getFullYear()} abidibo.net{' '}
          <a href="https://www.abidibo.net" target="_blank" rel="noreferrer">
            <Image style={{ display: 'inline', height: '26px', marginLeft: '.5rem' }} src={Logo} alt="logo" />
          </a>
        </Center>
      </GridItem>
    </Grid>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default BaseLayout
