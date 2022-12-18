import { Box, Button, Image as UiImage } from '@chakra-ui/react'
import Logger from '@Common/Utils/Logger'
import PropTypes from 'prop-types'
import { curry } from 'ramda'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Container = styled.div``

const Frame = styled(Box)`
  // border-width: 5px;
  position: relative;
`

const StartButton = styled(Button)`
  bottom: 0.5rem;
  left: 50%;
  margin-left: -100px;
  position: absolute !important;
  right: 0;
  width: 200px;
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
// const PAUSED = 2
const PLAYING = 3

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
      const intervalId = setInterval(() => {
        const nextIndex = idx++
        if (nextIndex === imagesUrls.length - 1) {
          setStatus(STOPPED)
          setCurrentIndex(0)
        } else {
          setCurrentIndex(nextIndex)
        }
      }, 50)
      return () => clearInterval(intervalId)
    } 
  }, [status])

  const handleStart = () => setStatus(PLAYING)

  Logger.info('Timelapse status: ', status)

  return (
    <Container>
      <Frame borderColor='gray.100'>
        <UiImage src={cover} style={{ zIndex: imagesUrls.length + 10 }} />
        <StartButton colorScheme='orange' isLoading={isLoading} onClick={handleStart}>{t('dashboard:ui.StartTimelapse')}</StartButton>
        {!isLoading && imagesUrls.map((url, index) => {
          const visibility = status === PLAYING && index === currentIndex ? 'visible' : 'hidden'
          const zIndex = index + 1
          return (
            <FrameImage
              key={index}
              src={url}
              style={{ zIndex, visibility }}
            />
          )
        })}
      </Frame>
    </Container>
  )
}

Timelapse.propTypes = {
  cover: PropTypes.string.isRequired,
  imagesUrls: PropTypes.arrayOf(PropTypes.string),
}

export default Timelapse
