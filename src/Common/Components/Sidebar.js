import Logo from '@Assets/Images/abidibo.png'
import { Center, Icon, Image, Link } from '@chakra-ui/react'
import { Link as RLink, useLocation } from 'react-router-dom'
import config, { makePath } from '@Config'
import { history } from '@Core/Redux/Store'
import { IoHomeOutline, } from 'react-icons/io5'

const Sidebar = () => {
  const goHome = () => history.push(config.urls.home)
  const location = useLocation()
  return (
    <nav>
      <Image cursor="pointer" onClick={goHome} src={Logo} alt="logo" width="54px" />
      <Center
        py={'1rem'}
        alignItems={'center'}
        justifyContent={'center'}
        w="100%"
        bg={location.pathname === makePath('home') ? 'yellow.500' : undefined}
      >
        <Link as={RLink} to={makePath('home')} lineHeight={0}>
          <Icon as={IoHomeOutline} color="white" w={8} h={8} />
        </Link>
      </Center>
    </nav>
  )
}

export default Sidebar
