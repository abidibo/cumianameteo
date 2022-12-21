import { Box, Heading, useColorMode, } from '@chakra-ui/react'
import ComponentsTheme from '@Theme/Components'
import { compose, F, T } from 'ramda'
import { useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { IoSettingsOutline } from 'react-icons/io5'
import Logo from './Logo'
import SettingsModal from './SettingsModal'

const Navbar = () => {
  // const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)

  const handleOpenSettings = compose(setSettingsModalIsOpen, T)
  const handleCloseSettings = compose(setSettingsModalIsOpen, F)

  return (
    <Box bg={ComponentsTheme.navbar.bg[colorMode]} display="flex" height="100%" alignItems="center" justifyContent="space-between" px={5}>
      <Heading colorScheme="orange" color='orange' fontSize={'1.6rem'}><Logo width='200px' height='34px' textColor={'orange'} iconColor='#44B2AE' /></Heading>
      <Box display="flex" gap={1}>
        <IoSettingsOutline size={24} onClick={handleOpenSettings} style={{ cursor: 'pointer' }} />
      </Box>
      {settingsModalIsOpen && (<SettingsModal onClose={handleCloseSettings} />)}
    </Box>
  )
}

export default Navbar
