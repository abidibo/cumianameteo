import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Box, Center, Heading, Image, Spinner } from '@chakra-ui/react'
import Bg from '@Assets/Images/startup-bg.jpg'
import Logo from '@Assets/Images/abidibo.png'

const Wrapper = styled(Box)`
  background: url(${Bg}) no-repeat center center;
  background-size: cover;
  color: #fff;
  min-height: 100vh;
`
const StartupView = () => {
  const { t } = useTranslation()

  return (
    <Wrapper display='flex' alignItems='center' flexDir='column' justifyContent='center'>
      <Center flexDir='column' gap={4}>
        <Image src={Logo} alt='logo' />
        <Heading>{t('ui.AppTitle')}</Heading>
        <Spinner size='lg' />
        {t('ui.Loading')}
      </Center>
    </Wrapper>
  )
}

export default StartupView
