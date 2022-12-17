import { Button, Image } from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Container = styled.div``

const Frame = styled.div`
  border: 5px solid #000;
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

const Timelapse = ({ cover }) => {
  const { t } = useTranslation()
  return (
    <Container>
      <Frame>
        <Image src={cover} />
        <StartButton>{t('dashboard:ui.StartTimelapse')}</StartButton>
      </Frame>
    </Container>
  )
}

Timelapse.propTypes = {
  cover: PropTypes.string.isRequired,
}

export default Timelapse
