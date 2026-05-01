import { Box, Text, Tooltip, useColorMode, useMediaQuery } from '@chakra-ui/react'
import { compose, F, T } from 'ramda'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IoHomeOutline,
  IoSettingsOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoTimeOutline,
  IoPartlySunnyOutline,
} from 'react-icons/io5'

import config from '@Config'
import { history } from '@Core/Redux/Store'
import ComponentsTheme from '@Theme/Components'
import theme from '@Theme'

import Logo from './Logo'
import SettingsModal from './SettingsModal'

const NavButton = ({ label, icon, onClick, isDark }) => (
  <Tooltip label={label}>
    <Box
      onClick={onClick}
      cursor="pointer"
      color={isDark ? 'gray.400' : 'gray.600'}
      _hover={{
        color: isDark ? '#10B981' : '#059669',
        borderColor: isDark ? 'rgba(16,185,129,0.4)' : 'rgba(5,150,105,0.3)',
        bg: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(5,150,105,0.04)',
      }}
      transition="all 0.2s"
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="1px solid"
      borderColor={isDark ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.08)'}
      borderRadius="2px"
      p={{ base: '5px', md: '6px' }}
    >
      {icon}
    </Box>
  </Tooltip>
)

const Navbar = () => {
  const { t } = useTranslation()
  const { colorMode, toggleColorMode } = useColorMode()
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)
  const isDark = colorMode === 'dark'

  const [isBigScreen] = useMediaQuery(`(min-width: ${theme.breakpoints.md})`)

  const handleOpenSettings = compose(setSettingsModalIsOpen, T)
  const handleCloseSettings = compose(setSettingsModalIsOpen, F)
  const handleGoToForecast = () => history.push(config.urls.forecast)
  const handleGoToHome = () => history.push(config.urls.home)
  const handleGoToDataHistory = () => history.push(config.urls.dataHistory)

  return (
    <Box
      bg={ComponentsTheme.navbar.bg[colorMode]}
      borderBottom="1px solid"
      borderColor={isDark ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.08)'}
      boxShadow={isDark ? '0 1px 24px rgba(0,0,0,0.5)' : '0 1px 8px rgba(0,0,0,0.06)'}
      display="flex"
      height="100%"
      alignItems="center"
      justifyContent="space-between"
      px={5}
      position="relative"
      _after={{
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: isDark
          ? 'linear-gradient(90deg, #10B981, transparent 50%)'
          : 'linear-gradient(90deg, #059669, transparent 50%)',
      }}
    >
      {/* Left: Station badge + Logo */}
      <Box display="flex" alignItems="center" gap={3}>
        {/* Live status dot */}
        <Box
          w="6px"
          h="6px"
          borderRadius="full"
          bg="#10B981"
          boxShadow="0 0 6px rgba(16,185,129,0.6)"
          flexShrink={0}
        />
        <Logo
          width={isBigScreen ? '180px' : '150px'}
          height="28px"
          textColor={isDark ? '#10B981' : '#059669'}
          iconColor={isDark ? '#F59E0B' : '#D97706'}
        />
        {isBigScreen && (
          <Text
            fontFamily={ComponentsTheme.fonts.heading}
            fontSize="xs"
            fontWeight="600"
            letterSpacing="widest"
            textTransform="uppercase"
            color={isDark ? 'rgba(16,185,129,0.5)' : 'rgba(5,150,105,0.4)'}
            ml={1}
          >
            // WX-01
          </Text>
        )}
      </Box>

      {/* Center: Coordinates (desktop only) */}
      {isBigScreen && (
        <Box
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Text
            fontFamily={ComponentsTheme.fonts.data}
            fontSize="11px"
            color={isDark ? 'gray.500' : 'gray.500'}
            letterSpacing="wider"
          >
            44.999 N / 7.365 E / 490m ASL
          </Text>
        </Box>
      )}

      {/* Right: Nav icons + Theme toggle */}
      <Box display="flex" gap={{ base: 1, md: 2 }} alignItems="center">
        <NavButton label={t('ui.Home')} icon={<IoHomeOutline size={18} />} onClick={handleGoToHome} isDark={isDark} />
        <NavButton label={t('ui.DataHistory')} icon={<IoTimeOutline size={18} />} onClick={handleGoToDataHistory} isDark={isDark} />
        <NavButton label={t('ui.Forecast')} icon={<IoPartlySunnyOutline size={18} />} onClick={handleGoToForecast} isDark={isDark} />

        {/* Separator */}
        <Box w="1px" h="20px" bg={isDark ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.08)'} mx={{ base: 0, md: 1 }} display={{ base: 'none', sm: 'block' }} />

        <NavButton
          label={isDark ? 'Light mode' : 'Dark mode'}
          icon={isDark ? <IoSunnyOutline size={18} /> : <IoMoonOutline size={18} />}
          onClick={toggleColorMode}
          isDark={isDark}
        />
        <NavButton label={t('ui.Settings')} icon={<IoSettingsOutline size={18} />} onClick={handleOpenSettings} isDark={isDark} />
      </Box>

      {settingsModalIsOpen && <SettingsModal onClose={handleCloseSettings} />}
    </Box>
  )
}

export default Navbar
