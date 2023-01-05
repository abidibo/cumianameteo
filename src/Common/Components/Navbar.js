import { Box, Heading, Tooltip, useColorMode, useMediaQuery } from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { compose, F, T } from 'ramda'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoHomeOutline, IoSettingsOutline, IoSunnyOutline, IoTimeOutline } from 'react-icons/io5'

import config from '@Config'
import { history } from '@Core/Redux/Store'
import ComponentsTheme from '@Theme/Components'
import theme from '@Theme'

import Logo from './Logo'
import SettingsModal from './SettingsModal'

const Navbar = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)

  const [isBigScreen] = useMediaQuery(`(min-width: ${theme.breakpoints.md})`)

  const handleOpenSettings = compose(setSettingsModalIsOpen, T)
  const handleCloseSettings = compose(setSettingsModalIsOpen, F)
  const handleGoToForecast = () => history.push(config.urls.forecast)
  const handleGoToHome = () => history.push(config.urls.home)
  const handleGoToDataHistory = () => history.push(config.urls.dataHistory)

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
        <Logo width={isBigScreen ? '200px' : '170px'} height="34px" textColor={colorMode === 'light' ? '#cc6600' : 'orange'} iconColor="#44B2AE" />
      </Heading>
      <Box display="flex" gap={4}>
        <Tooltip label={t('ui.Home')}>
          <span>
            <IoHomeOutline onClick={handleGoToHome} size={24} style={{ cursor: 'pointer' }} />
          </span>
        </Tooltip>
        <Tooltip label={t('ui.DataHistory')}>
          <span>
            <IoTimeOutline onClick={handleGoToDataHistory} size={24} style={{ cursor: 'pointer' }} />
          </span>
        </Tooltip>
        <Tooltip label={t('ui.Forecast')}>
          <span>
            <IoSunnyOutline onClick={handleGoToForecast} size={24} style={{ cursor: 'pointer' }} />
          </span>
        </Tooltip>
        <Tooltip label={t('ui.Settings')}>
          <span>
            <IoSettingsOutline size={24} onClick={handleOpenSettings} style={{ cursor: 'pointer' }} />
          </span>
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
