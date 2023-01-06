import {
  Box,
  Button,
  Image as UiImage,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { curry } from 'ramda'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCameraOutline, IoPauseOutline, IoPlayOutline } from 'react-icons/io5'
import styled from 'styled-components'

import Panel from '@Common/Components/Panel'
import Logger from '@Common/Utils/Logger'
import { round } from '@Common/Utils/Numbers'

const Frame = styled(Box)`
  // border-width: 5px;
  position: relative;
`

const SpeedSlider = styled.div`
  bottom: 1rem;
  position: absolute !important;
  left: 1rem;
  width: 160px;
  z-index: 1399;
`

const ProgressSlider = styled.div`
  margin: 0 6px;
`

const StartButton = styled(Button)`
  bottom: 1rem;
  position: absolute !important;
  right: 1rem;
  z-index: 1399;
`

const FrameImage = styled(UiImage)`
  left: 0;
  position: absolute;
  top: 0;
`

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

const Timelapse = ({ cover, imagesUrls }) => {
  const { t } = useTranslation()
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
  // eslint-disable-next-line no-console

  const tooltipLabels = {
    [STOPPED]: t('dashboard:ui.StartTimelapse'),
    [PLAYING]: t('dashboard:ui.StopTimelapse'),
    [PAUSED]: t('dashboard:ui.ResumeTimelapse'),
  }

  return (
    <Panel title={t('dashboard:ui.WebcamPanelTitle')} icon={<IoCameraOutline />}>
      <ProgressSlider>
        <Slider
          value={round((currentIndex * 100) / maxIndex)}
          colorScheme="blackAlpha"
          onChange={(p) => setCurrentIndex(round((p * maxIndex) / 100))}
          isDisabled={!(status === PLAYING || status === PAUSED)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </ProgressSlider>
      <Frame borderColor="gray.100">
        <UiImage src={cover} style={{ zIndex: imagesUrls.length + 10 }} />
        <Tooltip label={t('dashboard:ui.TimelapseSpeed')}>
          <SpeedSlider>
            <Slider
              defaultValue={speed}
              colorScheme="orange"
              onChangeEnd={setSpeed}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="teal.500"
                color="white"
                placement="top"
                isOpen={showTooltip}
                label={`${speedToHz(speed)} Hz`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </SpeedSlider>
        </Tooltip>
        <Tooltip label={tooltipLabels[status]}>
          <StartButton size="sm" colorScheme="orange" isLoading={isLoading} onClick={handleStatusChange}>
            {status === STOPPED && <IoPlayOutline size={26} />}
            {status === PAUSED && <IoPlayOutline size={26} />}
            {status === PLAYING && <IoPauseOutline size={26} />}
            {status === STOPPED && tooltipLabels[status]}
          </StartButton>
        </Tooltip>
        {!isLoading &&
          imagesUrls.map((url, index) => {
            const visibility =
              (status === PLAYING || status === PAUSED) && index === currentIndex ? 'visible' : 'hidden'
            const zIndex = index + 1
            return <FrameImage key={index} src={url} style={{ zIndex, visibility }} />
          })}
      </Frame>
    </Panel>
  )
}

Timelapse.propTypes = {
  cover: PropTypes.string.isRequired,
  imagesUrls: PropTypes.arrayOf(PropTypes.string),
}

export default Timelapse
