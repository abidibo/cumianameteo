import { keyframes } from '@emotion/react'
import { Box, Center, Image, Text } from '@chakra-ui/react'
import Bg from '@Assets/Images/startup-bg.jpg'
import Logo from '@Assets/Images/abidibo.png'
import ComponentsTheme from '@Theme/Components'

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const scanLine = keyframes`
  0% { top: -2px; }
  100% { top: 100%; }
`

const StartupView = () => {
  return (
    <Box
      position="relative"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        background: `url(${Bg}) no-repeat center center`,
        backgroundSize: 'cover',
        filter: 'brightness(0.2) saturate(0.3)',
      }}
    >
      {/* Scan line */}
      <Box
        position="absolute"
        left={0}
        right={0}
        h="2px"
        bg="rgba(16,185,129,0.15)"
        zIndex={2}
        animation={`${scanLine} 3s linear infinite`}
        pointerEvents="none"
      />

      <Center flexDir="column" gap={6} position="relative" zIndex={1}>
        <Image src={Logo} alt="logo" w="80px" opacity={0.9} />

        <Box textAlign="center">
          <Text
            fontFamily={ComponentsTheme.fonts.heading}
            fontSize="2xl"
            fontWeight="700"
            color="#10B981"
            textTransform="uppercase"
            letterSpacing="widest"
          >
            CUMIANA WX-01
          </Text>
          <Text
            fontFamily={ComponentsTheme.fonts.data}
            fontSize="xs"
            color="gray.500"
            letterSpacing="wider"
            mt={1}
          >
            44.999 N / 7.365 E / 490m ASL
          </Text>
        </Box>

        <Box display="flex" alignItems="center" gap={2} mt={4}>
          <Text
            fontFamily={ComponentsTheme.fonts.data}
            fontSize="sm"
            color="gray.400"
            letterSpacing="wider"
            textTransform="uppercase"
          >
            INITIALIZING SYSTEM
          </Text>
          <Text
            fontFamily={ComponentsTheme.fonts.data}
            fontSize="sm"
            color="#10B981"
            animation={`${blink} 1s step-end infinite`}
          >
            _
          </Text>
        </Box>

        {/* Progress bar */}
        <Box
          w="200px"
          h="2px"
          bg="rgba(16,185,129,0.1)"
          borderRadius="0"
          overflow="hidden"
        >
          <Box
            h="100%"
            bg="#10B981"
            animation="loading 2s ease-in-out infinite"
            sx={{
              '@keyframes loading': {
                '0%': { width: '0%', marginLeft: '0%' },
                '50%': { width: '60%', marginLeft: '20%' },
                '100%': { width: '0%', marginLeft: '100%' },
              },
            }}
          />
        </Box>
      </Center>
    </Box>
  )
}

export default StartupView
