import { Box, Heading, useColorMode } from '@chakra-ui/react'
import PropTypes from 'prop-types'
import ComponentsTheme from '@Theme/Components'

const Panel = ({ title, children, boxProps, icon }) => {
  const { colorMode } = useColorMode()
  return (
    <Box {...boxProps}>
      <Heading display={'flex'} alignItems='center' gap='.5rem' padding={'.5rem'} bg={ComponentsTheme.panel.heading.bg[colorMode]} size='md'>
        {icon}
        {title}
      </Heading>
      {children}
    </Box>
  ) 
}

Panel.defaultProps = {
  boxProps: {},
}

Panel.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node, PropTypes.string]).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  boxProps: PropTypes.object,
}
export default Panel
