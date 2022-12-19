import { Box, Button, Image as UiImage, Tooltip } from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { curry } from 'ramda'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCameraOutline, IoPauseOutline, IoPlayOutline } from 'react-icons/io5'
import styled from 'styled-components'

import Logger from '@Common/Utils/Logger'
import Panel from '@Common/Components/Panel'

const Frame = styled(Box)`
  // border-width: 5px;
  position: relative;
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

const Timelapse = ({ cover, imagesUrls }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState(STOPPED)
  const [currentIndex, setCurrentIndex] = useState(0)

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
      let idx = currentIndex
      intervalId = setInterval(() => {
        const nextIndex = idx++
        if (nextIndex === imagesUrls.length - 1) {
          setStatus(STOPPED)
          setCurrentIndex(0)
        } else {
          setCurrentIndex(nextIndex)
        }
      }, 50)
      return () => clearInterval(intervalId)
    } else if (status === STOPPED) {
      clearInterval(intervalId)
    }
  }, [status])

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
      <Frame borderColor="gray.100">
        <UiImage src={cover} style={{ zIndex: imagesUrls.length + 10 }} />
        <Tooltip label={tooltipLabels[status]}>
          <StartButton size='sm' colorScheme="orange" isLoading={isLoading} onClick={handleStatusChange}>
            {status === STOPPED && <IoPlayOutline size={26} />}
            {status === PAUSED && <IoPlayOutline size={26} />}
            {status === PLAYING && <IoPauseOutline size={26} />}
            {status === STOPPED && tooltipLabels[status]}
          </StartButton>
        </Tooltip>
        {!isLoading &&
          imagesUrls.map((url, index) => {
            const visibility = (status === PLAYING || status === PAUSED) && index === currentIndex ? 'visible' : 'hidden'
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
