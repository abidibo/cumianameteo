// import Sidebar from '@Common/Components/Sidebar'
import { Center, Grid, GridItem, Image } from '@chakra-ui/react'
import PropTypes from 'prop-types'

import Logo from '@Assets/Images/abidibo.png'
import Navbar from '@Common/Components/Navbar'

/**
 * The base layout (almost) all views extend
 *
 * @param {Component} props.children - the main content
 * @param {Boolean} props.withFab - if the view contains a fab button, anm additional bottom padding is added
 */
const BaseLayout = ({ children }) => {
  return (
    <Grid
      minH="100vh"
      templateAreas={`"nav header"
                  "nav main"
                  "nav footer"`}
      gridTemplateRows={'60px 1fr 40px'}
      gridTemplateColumns={'1fr'}
      gap="0"
    >
      <GridItem bg="black" area="header">
        <Navbar />
      </GridItem>
      <GridItem bg="blackAlpha.900" area="main">
        {children}
      </GridItem>
      <GridItem bg="black" color="white" area="footer" p={2}>
        <Center>
          Copyright 2022 abidibo.net <Image style={{ display: 'inline', height: '26px', marginLeft: '.5rem' }} src={Logo} alt="logo" />
        </Center>
      </GridItem>
    </Grid>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default BaseLayout
