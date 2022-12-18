import PropTypes from 'prop-types'
import Navbar from '@Common/Components/Navbar'
import Sidebar from '@Common/Components/Sidebar'
import { Center, Grid, GridItem } from '@chakra-ui/react'

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
      gridTemplateColumns={'60px 1fr'}
      gap="0"
    >
      <GridItem bg="gray.900" area="nav">
        <Sidebar />
      </GridItem>
      <GridItem bg="cyan.900" area="header">
        <Navbar />
      </GridItem>
      <GridItem bg="white" area="main">
        {children}
      </GridItem>
      <GridItem bg="gray.100" area="footer" p={2}>
        <Center>Copyright 2022 - Otto srl</Center>
      </GridItem>
    </Grid>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default BaseLayout
