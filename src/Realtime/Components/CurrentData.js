import { keyframes } from '@emotion/react'
import { Box, SimpleGrid, Text, useColorMode } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCurrentDataQuery } from '@Realtime/Services/Api'
import { windDirection } from '@Realtime/Utils/Wind'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GiDew } from 'react-icons/gi'
import { IoCalendarOutline } from 'react-icons/io5'
import { WiBarometer, WiHumidity, WiRain, WiWindy } from 'react-icons/wi'
import ComponentsTheme from '@Theme/Components'

import { withLoader } from '@Common/Utils/HOF'

const MotionText = motion(Text)

const radarSweep = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const COLORS = {
  datetime: '#06B6D4',
  temperature: '#EF4444',
  pressure: '#06B6D4',
  humidity: '#3B82F6',
  dewpoint: '#8B5CF6',
  rain: '#3B82F6',
  wind: '#F59E0B',
}

const StatCard = ({ icon, label, color, isDark, children, value, unit, min, max }) => {
  const numValue = parseFloat(value)
  const numMin = parseFloat(min)
  const numMax = parseFloat(max)
  const range = numMax - numMin
  const pct = range > 0 ? Math.max(0, Math.min(100, ((numValue - numMin) / range) * 100)) : 50
  const showRange = min !== undefined && max !== undefined && range > 0
  const panelBg = isDark ? 'rgba(13,20,32,0.9)' : ComponentsTheme.panel.bg.light
  const panelBorder = isDark ? 'rgba(16,185,129,0.1)' : 'rgba(14,116,144,0.18)'
  const ink = isDark ? 'white' : '#10202C'
  const muted = isDark ? 'gray.400' : '#526575'
  const faint = isDark ? 'gray.400' : '#647887'
  const rangeBg = isDark ? 'whiteAlpha.100' : 'rgba(14,116,144,0.14)'

  return (
    <Box
      borderRadius="2px"
      border="1px solid"
      borderColor={panelBorder}
      bg={panelBg}
      p={4}
      position="relative"
      overflow="hidden"
      boxShadow={isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 6px 16px rgba(15,39,55,0.08)'}
      transition="box-shadow 0.2s"
      _hover={{
        boxShadow: isDark
          ? `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${color}22`
          : `0 8px 20px rgba(15,39,55,0.12), 0 0 0 1px ${color}44`,
      }}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${color}, transparent 70%)`,
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="28px"
          h="28px"
          borderRadius="2px"
          flexShrink={0}
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </Box>
        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="wider"
          fontWeight="600"
          fontFamily={ComponentsTheme.fonts.heading}
          color={muted}
          lineHeight={1.05}
        >
          {label}
        </Text>
      </Box>

      {children || (
        <AnimatePresence mode="wait">
          <MotionText
            key={value}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            fontSize="3xl"
            fontWeight="bold"
            fontFamily={ComponentsTheme.fonts.data}
            color={ink}
            lineHeight={1}
            mb={showRange ? 3 : 0}
            textShadow={isDark ? `0 0 12px ${color}30` : 'none'}
          >
            {value}
            <Text as="span" fontSize="sm" fontWeight="normal" color={muted} ml={1}>
              {unit}
            </Text>
          </MotionText>
        </AnimatePresence>
      )}

      {showRange && (
        <Box mt={2}>
          <Box h="4px" bg={rangeBg} borderRadius="0" mb={1} overflow="hidden">
            <Box
              h="100%"
              borderRadius="0"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${color}55, ${color})`,
                transition: 'width 0.8s ease',
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Text fontSize="xs" fontFamily={ComponentsTheme.fonts.data} color={faint}>
              {min} {unit}
            </Text>
            <Text fontSize="xs" fontFamily={ComponentsTheme.fonts.data} color={faint}>
              {max} {unit}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  )
}

StatCard.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  color: PropTypes.string,
  isDark: PropTypes.bool,
  children: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export const HeroTemperature = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { data, isFetching } = useCurrentDataQuery()
  const [now, setNow] = useState(() => dayjs())
  const isDark = colorMode === 'dark'
  const panelBg = isDark ? 'rgba(13,20,32,0.95)' : ComponentsTheme.panel.bg.light
  const panelBorder = isDark ? 'rgba(16,185,129,0.1)' : 'rgba(14,116,144,0.18)'
  const ink = isDark ? 'white' : '#10202C'
  const muted = isDark ? 'gray.400' : '#526575'
  const faint = isDark ? 'gray.500' : '#647887'
  const liveColor = isDark ? '#10B981' : '#0E7490'

  useEffect(() => {
    const intervalId = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(intervalId)
  }, [])

  return withLoader(
    () => {
      const lastSample = dayjs(data.datetime)

      return (
        <Box
          borderRadius="2px"
          border="1px solid"
          borderColor={panelBorder}
          bg={panelBg}
          p={6}
          position="relative"
          overflow="hidden"
          h="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${COLORS.temperature}, transparent 60%)`,
          }}
        >
          {/* Datetime */}
          <Box
            display="flex"
            alignItems={{ base: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            gap={4}
            mb={5}
            flexWrap="wrap"
          >
            <Box display="flex" alignItems="center" gap={3}>
              <Box position="relative" w="16px" h="16px" display="flex" alignItems="center" justifyContent="center">
                <Box
                  position="absolute"
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  border="1px solid"
                  borderColor={isDark ? 'rgba(16,185,129,0.3)' : 'rgba(14,116,144,0.24)'}
                />
                <Box
                  position="absolute"
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, ${isDark ? 'rgba(16,185,129,0.6)' : 'rgba(16,185,129,0.5)'} 40deg, transparent 80deg)`,
                    animation: `${radarSweep} 2.5s linear infinite`,
                  }}
                />
                <Box w="4px" h="4px" borderRadius="full" bg="#10B981" position="relative" zIndex={1} boxShadow="0 0 4px rgba(16,185,129,0.8)" />
              </Box>
              <Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box color={COLORS.datetime} display="flex">
                    <IoCalendarOutline size={16} />
                  </Box>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="widest"
                    fontWeight="bold"
                    fontFamily={ComponentsTheme.fonts.data}
                    color={liveColor}
                  >
                    LIVE / {t('realtime:ui.Datetime')}
                  </Text>
                </Box>
                <Text
                  fontSize="sm"
                  fontFamily={ComponentsTheme.fonts.data}
                  color={muted}
                  letterSpacing="wider"
                  mt={1}
                >
                  {now.format('DD MMM YYYY').toUpperCase()}
                </Text>
              </Box>
            </Box>

            <Box textAlign={{ base: 'left', md: 'right' }}>
              <Text
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="bold"
                fontFamily={ComponentsTheme.fonts.data}
                color={ink}
                lineHeight={1}
                textShadow={isDark ? `0 0 12px ${COLORS.datetime}25` : 'none'}
              >
                {now.format('HH:mm:ss')}
              </Text>
              <Text
                fontSize="xs"
                fontFamily={ComponentsTheme.fonts.data}
                color={faint}
                letterSpacing="wider"
                mt={1}
              >
                LAST {lastSample.format('HH:mm')}
              </Text>
            </Box>
          </Box>

          {/* Hero temperature */}
          <Box display="flex" alignItems="baseline" gap={2} mb={2}>
            <AnimatePresence mode="wait">
              <MotionText
                key={data.temperature}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                fontSize="6xl"
                fontWeight="bold"
                fontFamily={ComponentsTheme.fonts.data}
                color={ink}
                lineHeight={1}
                textShadow={isDark ? `0 0 20px ${COLORS.temperature}25` : 'none'}
              >
                {data.temperature}
              </MotionText>
            </AnimatePresence>
            <Text
              fontSize="xl"
              fontFamily={ComponentsTheme.fonts.data}
              color={muted}
            >
              °C
            </Text>
          </Box>

          {/* Min / Max */}
          <Box display="flex" gap={4} mb={5}>
            <Text fontSize="sm" fontFamily={ComponentsTheme.fonts.data} color={muted} letterSpacing="wider">
              MIN {data.temperature_min}°C
            </Text>
            <Text fontSize="sm" fontFamily={ComponentsTheme.fonts.data} color={muted} letterSpacing="wider">
              MAX {data.temperature_max}°C
            </Text>
          </Box>

          {/* Compact secondary readings */}
          <SimpleGrid columns={3} spacing={3}>
            <Box>
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="wider" fontFamily={ComponentsTheme.fonts.heading} color={muted} mb={1}>
                {t('realtime:ui.Pressure')}
              </Text>
              <Text fontSize="lg" fontFamily={ComponentsTheme.fonts.data} color={isDark ? '#06B6D4' : '#0891B2'} lineHeight={1}>
                {data.pressure}
                <Text as="span" fontSize="xs" color={muted} ml={1}>hPa</Text>
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="wider" fontFamily={ComponentsTheme.fonts.heading} color={muted} mb={1}>
                {t('realtime:ui.RelativeHumidity')}
              </Text>
              <Text fontSize="lg" fontFamily={ComponentsTheme.fonts.data} color={isDark ? '#3B82F6' : '#2563EB'} lineHeight={1}>
                {data.relative_humidity}
                <Text as="span" fontSize="xs" color={muted} ml={1}>%</Text>
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="wider" fontFamily={ComponentsTheme.fonts.heading} color={muted} mb={1}>
                {t('realtime:ui.Wind')}
              </Text>
              <Text fontSize="lg" fontFamily={ComponentsTheme.fonts.data} color={isDark ? '#F59E0B' : '#D97706'} lineHeight={1}>
                {data.wind_strength}
                <Text as="span" fontSize="xs" color={muted} ml={1}>km/h {windDirection(data.wind_dir)}</Text>
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      )
    },
    isFetching,
  )
}

const CurrentData = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { data, isFetching } = useCurrentDataQuery()
  const isDark = colorMode === 'dark'
  const ink = isDark ? 'white' : '#10202C'
  const muted = isDark ? 'gray.400' : '#526575'

  return withLoader(
    () => (
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={3} alignSelf="start" alignItems="start">
        {/* Pressure */}
        <StatCard
          icon={<WiBarometer size={22} />}
          label={t('realtime:ui.Pressure')}
          color={COLORS.pressure}
          isDark={isDark}
          value={data.pressure}
          unit="hPa"
          min={data.pressure_min}
          max={data.pressure_max}
        />

        {/* Humidity */}
        <StatCard
          icon={<WiHumidity size={22} />}
          label={t('realtime:ui.RelativeHumidity')}
          color={COLORS.humidity}
          isDark={isDark}
          value={data.relative_humidity}
          unit="%"
          min={data.relative_humidity_min}
          max={data.relative_humidity_max}
        />

        {/* Dewpoint */}
        <StatCard
          icon={<GiDew size={18} />}
          label={t('realtime:ui.Dewpoint')}
          color={COLORS.dewpoint}
          isDark={isDark}
          value={data.dewpoint}
          unit="°C"
          min={data.dewpoint_min}
          max={data.dewpoint_max}
        />

        {/* Rain */}
        <StatCard icon={<WiRain size={22} />} label={t('realtime:ui.Rain')} color={COLORS.rain} isDark={isDark}>
          <Text fontSize="3xl" fontWeight="bold" fontFamily={ComponentsTheme.fonts.data} color={ink} lineHeight={1}
            textShadow={isDark ? `0 0 12px ${COLORS.rain}30` : 'none'}
          >
            {data.rain_rate}
            <Text as="span" fontSize="sm" fontWeight="normal" color={muted} ml={1}>
              mm/h
            </Text>
          </Text>
          <Text fontSize="xs" fontFamily={ComponentsTheme.fonts.data} color={muted} mt={2} letterSpacing="wider">
            {data.rain} mm | {data.rain_month} mm {t('ui.Month')} | {data.rain_year} mm {t('ui.Year')}
          </Text>
        </StatCard>

        {/* Wind */}
        <StatCard icon={<WiWindy size={22} />} label={t('realtime:ui.Wind')} color={COLORS.wind} isDark={isDark}>
          <Text fontSize="3xl" fontWeight="bold" fontFamily={ComponentsTheme.fonts.data} color={ink} lineHeight={1}
            textShadow={isDark ? `0 0 12px ${COLORS.wind}30` : 'none'}
          >
            {data.wind_strength}
            <Text as="span" fontSize="sm" fontWeight="normal" color={muted} ml={1}>
              km/h
            </Text>
          </Text>
          <Text
            fontSize="md"
            fontWeight="600"
            fontFamily={ComponentsTheme.fonts.data}
            lineHeight={1}
            mt={1}
            style={{ color: COLORS.wind }}
          >
            {windDirection(data.wind_dir)}
          </Text>
          <Text fontSize="xs" fontFamily={ComponentsTheme.fonts.data} color={muted} mt={1} letterSpacing="wider">
            MAX {data.wind_strength_max} km/h {windDirection(data.wind_dir_max)}
          </Text>
        </StatCard>
      </SimpleGrid>
    ),
    isFetching,
  )
}

export default CurrentData
