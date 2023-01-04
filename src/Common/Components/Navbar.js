import { Box, Heading, Tooltip, useColorMode } from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { compose, F, T } from 'ramda'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoHomeOutline, IoSettingsOutline, IoSunnyOutline } from 'react-icons/io5'

import config from '@Config'
import { history } from '@Core/Redux/Store'
import ComponentsTheme from '@Theme/Components'

import Logo from './Logo'
import SettingsModal from './SettingsModal'

const Navbar = ({ dashboard, forecast }) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)

  const handleOpenSettings = compose(setSettingsModalIsOpen, T)
  const handleCloseSettings = compose(setSettingsModalIsOpen, F)
  const handleGoToForecast = () => history.push(config.urls.forecast)
  const handleGoToHome = () => history.push(config.urls.home)

  return (
    <Box
      bg={ComponentsTheme.navbar.bg[colorMode]}
      display="flex"
      height="100%"
      alignItems="center"
      justifyContent="space-between"
      px={5}
    >
      <Heading colorScheme="orange" color="orange" fontSize={'1.6rem'}>
        <Logo width="200px" height="34px" textColor={'orange'} iconColor="#44B2AE" />
      </Heading>
      <Box display="flex" gap={4}>
        {dashboard && (
          <Tooltip label={t('ui.Forecast')}>
            <span><IoSunnyOutline onClick={handleGoToForecast} size={24} style={{ cursor: 'pointer' }} /></span>
          </Tooltip>
        )}
        {forecast && (
          <Tooltip label={t('ui.Home')}>
            <span><IoHomeOutline onClick={handleGoToHome} size={24} style={{ cursor: 'pointer' }} /></span>
          </Tooltip>
        )}
        <Tooltip label={t('ui.Settings')}>
          <span><IoSettingsOutline size={24} onClick={handleOpenSettings} style={{ cursor: 'pointer' }} /></span>
        </Tooltip>
      </Box>
      {settingsModalIsOpen && <SettingsModal onClose={handleCloseSettings} />}
    </Box>
  )
}

Navbar.propTypes = {
  dashboard: PropTypes.bool,
  forecast: PropTypes.bool,
}

export default Navbar
