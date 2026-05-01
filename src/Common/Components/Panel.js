import { Box, Heading, useColorMode } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import PropTypes from 'prop-types'
import ComponentsTheme from '@Theme/Components'

const scanSweep = keyframes`
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`

const Panel = ({ title, children, boxProps, icon }) => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <Box position="relative" {...boxProps}>
      {/* HUD corner brackets */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        pointerEvents="none"
        zIndex={1}
        _before={{
          content: '""',
          position: 'absolute',
          top: '-1px',
          left: '-1px',
          width: '12px',
          height: '12px',
          borderTop: `2px solid ${isDark ? '#10B981' : '#059669'}`,
          borderLeft: `2px solid ${isDark ? '#10B981' : '#059669'}`,
        }}
        _after={{
          content: '""',
          position: 'absolute',
          top: '-1px',
          right: '-1px',
          width: '12px',
          height: '12px',
          borderTop: `2px solid ${isDark ? '#10B981' : '#059669'}`,
          borderRight: `2px solid ${isDark ? '#10B981' : '#059669'}`,
        }}
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        pointerEvents="none"
        zIndex={1}
        _before={{
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          left: '-1px',
          width: '12px',
          height: '12px',
          borderBottom: `2px solid ${isDark ? '#10B981' : '#059669'}`,
          borderLeft: `2px solid ${isDark ? '#10B981' : '#059669'}`,
        }}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          right: '-1px',
          width: '12px',
          height: '12px',
          borderBottom: `2px solid ${isDark ? '#10B981' : '#059669'}`,
          borderRight: `2px solid ${isDark ? '#10B981' : '#059669'}`,
        }}
      />

      {/* Panel body */}
      <Box
        borderRadius="2px"
        overflow="hidden"
        border="1px solid"
        borderColor={isDark ? ComponentsTheme.panel.border.dark : ComponentsTheme.panel.border.light}
        bg={isDark ? ComponentsTheme.panel.bg.dark : ComponentsTheme.panel.bg.light}
        boxShadow={
          isDark
            ? '0 0 30px rgba(16,185,129,0.04), 0 8px 32px rgba(0,0,0,0.45)'
            : '0 2px 12px rgba(0,0,0,0.07)'
        }
        position="relative"
        _after={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16,185,129,0.015) 2px, rgba(16,185,129,0.015) 3px)'
            : 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Top accent line */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="1px"
          background={`linear-gradient(90deg, ${isDark ? '#10B981' : '#059669'}, transparent 70%)`}
          zIndex={2}
        />

        {/* Scan-line sweep */}
        {isDark && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            pointerEvents="none"
            zIndex={2}
            overflow="hidden"
          >
            <Box
              position="absolute"
              left={0}
              right={0}
              h="40px"
              background="linear-gradient(180deg, transparent, rgba(16,185,129,0.03), transparent)"
              animation={`${scanSweep} 8s linear infinite`}
            />
          </Box>
        )}

        {/* Heading */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          px={4}
          py={3}
          borderBottom="1px solid"
          borderColor={isDark ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.06)'}
          bg={isDark ? ComponentsTheme.panel.heading.bg.dark : ComponentsTheme.panel.heading.bg.light}
          position="relative"
          zIndex={1}
        >
          {icon && (
            <Box color={isDark ? '#10B981' : '#059669'} display="flex">
              {icon}
            </Box>
          )}
          <Heading
            size="xs"
            letterSpacing="widest"
            textTransform="uppercase"
            color={isDark ? ComponentsTheme.panel.heading.color.dark : ComponentsTheme.panel.heading.color.light}
            fontWeight="semibold"
            fontFamily={ComponentsTheme.fonts.heading}
          >
            {title}
          </Heading>
        </Box>

        {/* Content */}
        <Box position="relative" zIndex={1}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

Panel.defaultProps = {
  boxProps: {},
}

Panel.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node, PropTypes.string]).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  boxProps: PropTypes.object,
}

export default Panel
