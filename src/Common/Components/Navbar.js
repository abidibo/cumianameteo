import { Box, Heading, } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { t } = useTranslation()

  return (
    <Box color="white" display="flex" height="100%" alignItems="center" justifyContent="space-between" px={5}>
      <Heading fontSize={'1.6rem'}>{t('ui.AppTitle')} - Work in progress</Heading>
    </Box>
  )
}

export default Navbar
