import {
  Box,
  Button,
  Image as UiImage,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { curry } from 'ramda'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCameraOutline, IoPauseOutline, IoPlayOutline } from 'react-icons/io5'

import Panel from '@Common/Components/Panel'
import Logger from '@Common/Utils/Logger'
import { round } from '@Common/Utils/Numbers'
import ComponentsTheme from '@Theme/Components'

const preloadImage = curry((cb, url) => {
  const image = new Image()
  image.src = url
  image.onload = cb
})

const STOPPED = 1
const PLAYING = 2
const PAUSED = 3

let intervalId

const speedToInterval = (speed) => 300 - 2.9 * speed
const speedToHz = (speed) => round(1000 / speedToInterval(speed), 1)

const padFrame = (n) => String(n).padStart(3, '0')

const sliderStyles = (isDark) => ({
  sx: {
    '& .chakra-slider__thumb': {
      borderRadius: '2px',
      w: '14px',
      h: '14px',
      border: '1px solid',
      borderColor: isDark ? 'rgba(16,185,129,0.5)' : 'rgba(14,116,144,0.42)',
      bg: isDark ? '#0d1420' : ComponentsTheme.panel.bg.light,
      boxShadow: isDark ? '0 0 6px rgba(16,185,129,0.3)' : '0 0 5px rgba(14,116,144,0.14)',
    },
    '& .chakra-slider__filled-track': {
      bg: isDark ? '#10B981' : '#0E7490',
    },
    '& .chakra-slider__track': {
      bg: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(14,116,144,0.14)',
      h: '4px',
      borderRadius: '0',
    },
  },
})

const Timelapse = ({ cover, imagesUrls }) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState(STOPPED)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [speed, setSpeed] = useState(85)
  const [showTooltip, setShowTooltip] = useState(false)

  const maxIndex = imagesUrls.length - 1

  const animate = () => {
    let idx = currentIndex
    return setInterval(() => {
      const nextIndex = idx++
      if (nextIndex === imagesUrls.length - 1) {
        setStatus(STOPPED)
        setCurrentIndex(0)
      } else {
        setCurrentIndex(nextIndex)
      }
    }, speedToInterval(speed))
  }

  useEffect(() => {
    let counter = 0
    const increaseCounter = () => {
      counter = counter + 1
      counter === imagesUrls.length && setIsLoading(false)
    }
    imagesUrls.map(preloadImage(increaseCounter))
  }, [imagesUrls])

  useEffect(() => {
    if (status === PLAYING) {
      Logger.debug('Timelapse, playing')
      intervalId = animate()
      return () => clearInterval(intervalId)
    } else if (status === STOPPED) {
      clearInterval(intervalId)
    }
  }, [status])

  useEffect(() => {
    if (status === PLAYING) {
      clearInterval(intervalId)
      intervalId = animate()
    }
  }, [speed])

  const handleStatusChange = () => {
    setStatus(status === STOPPED || status === PAUSED ? PLAYING : PAUSED)
  }

  Logger.info('Timelapse status: ', status)

  const tooltipLabels = {
    [STOPPED]: t('dashboard:ui.StartTimelapse'),
    [PLAYING]: t('dashboard:ui.StopTimelapse'),
    [PAUSED]: t('dashboard:ui.ResumeTimelapse'),
  }

  const isActive = status === PLAYING || status === PAUSED

  return (
    <Panel title={t('dashboard:ui.WebcamPanelTitle')} icon={<IoCameraOutline />}>
      {/* Progress bar + frame counter */}
      <Box display="flex" alignItems="center" gap={3} px={2} py={1}>
        <Text
          fontSize="11px"
          fontFamily={ComponentsTheme.fonts.data}
          color={isDark ? 'gray.500' : '#647887'}
          letterSpacing="wider"
          flexShrink={0}
          minW="120px"
        >
          FRM {padFrame(isActive ? currentIndex + 1 : 0)} / {padFrame(imagesUrls.length)}
        </Text>
        <Box flex={1}>
          <Slider
            value={maxIndex > 0 ? round((currentIndex * 100) / maxIndex) : 0}
            onChange={(p) => setCurrentIndex(round((p * maxIndex) / 100))}
            isDisabled={!isActive}
            {...sliderStyles(isDark)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
      </Box>

      {/* Frame area */}
      <Box position="relative" borderColor={isDark ? 'rgba(16,185,129,0.1)' : 'gray.100'}>
        <UiImage src={cover} style={{ zIndex: imagesUrls.length + 10 }} />

        {/* Speed slider */}
        <Tooltip
          label={t('dashboard:ui.TimelapseSpeed')}
          placement="top"
          bg={isDark ? '#0d1420' : ComponentsTheme.panel.bg.light}
          color={isDark ? '#10B981' : '#0E7490'}
          borderRadius="2px"
          border="1px solid"
          borderColor={isDark ? 'rgba(16,185,129,0.2)' : 'rgba(14,116,144,0.18)'}
          fontFamily={ComponentsTheme.fonts.data}
          fontSize="xs"
        >
          <Box
            position="absolute"
            bottom="1rem"
            left="1rem"
            w="160px"
            zIndex={1399}
          >
            <Slider
              defaultValue={speed}
              onChangeEnd={setSpeed}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              {...sliderStyles(isDark)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg={isDark ? '#0d1420' : ComponentsTheme.panel.bg.light}
                color={isDark ? '#F59E0B' : '#D97706'}
                border="1px solid"
                borderColor={isDark ? 'rgba(245,158,11,0.3)' : 'rgba(217,119,6,0.22)'}
                borderRadius="2px"
                fontFamily={ComponentsTheme.fonts.data}
                fontSize="xs"
                placement="top"
                isOpen={showTooltip}
                label={`${speedToHz(speed)} Hz`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </Box>
        </Tooltip>

        {/* Play/Pause button */}
        <Tooltip
          label={tooltipLabels[status]}
          placement="top"
          bg={isDark ? '#0d1420' : ComponentsTheme.panel.bg.light}
          color={isDark ? '#F59E0B' : '#D97706'}
          borderRadius="2px"
          border="1px solid"
          borderColor={isDark ? 'rgba(245,158,11,0.3)' : 'rgba(217,119,6,0.22)'}
          fontFamily={ComponentsTheme.fonts.data}
          fontSize="xs"
        >
          <Button
            size="sm"
            position="absolute"
            bottom="1rem"
            right="1rem"
            zIndex={1399}
            isLoading={isLoading}
            onClick={handleStatusChange}
            borderRadius="2px"
            bg={isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)'}
            color={isDark ? '#F59E0B' : '#D97706'}
            border="1px solid"
            borderColor={isDark ? 'rgba(245,158,11,0.3)' : 'rgba(217,119,6,0.3)'}
            fontFamily={ComponentsTheme.fonts.data}
            fontSize="xs"
            letterSpacing="wider"
            textTransform="uppercase"
            _hover={{
              bg: isDark ? 'rgba(245,158,11,0.25)' : 'rgba(245,158,11,0.2)',
              boxShadow: isDark ? '0 0 12px rgba(245,158,11,0.2)' : '0 0 8px rgba(245,158,11,0.15)',
            }}
            _active={{
              bg: isDark ? 'rgba(245,158,11,0.35)' : 'rgba(245,158,11,0.3)',
            }}
            leftIcon={
              status === PLAYING
                ? <IoPauseOutline size={16} />
                : <IoPlayOutline size={16} />
            }
          >
            {status === STOPPED && tooltipLabels[status]}
          </Button>
        </Tooltip>

        {/* Frames */}
        {!isLoading &&
          imagesUrls.map((url, index) => {
            const visibility = isActive && index === currentIndex ? 'visible' : 'hidden'
            const zIndex = index + 1
            return (
              <UiImage
                key={index}
                src={url}
                position="absolute"
                left={0}
                top={0}
                style={{ zIndex, visibility }}
              />
            )
          })}
      </Box>
    </Panel>
  )
}

Timelapse.propTypes = {
  cover: PropTypes.string.isRequired,
  imagesUrls: PropTypes.arrayOf(PropTypes.string),
}

export default Timelapse
