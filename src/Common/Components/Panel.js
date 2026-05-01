import { Box, Heading, useColorMode } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import PropTypes from 'prop-types'
import ComponentsTheme from '@Theme/Components'

const scanSweep = keyframes`
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`

const Panel = ({ title, children, boxProps, icon, variant }) => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const isSubtle = variant === 'subtle'
  const bracketColor = isDark
    ? isSubtle ? 'rgba(16,185,129,0.45)' : '#10B981'
    : isSubtle ? 'rgba(14,116,144,0.36)' : '#0E7490'
  const bracketSize = isSubtle ? '8px' : '12px'
  const bracketWidth = isSubtle ? '1px' : '2px'

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
          width: bracketSize,
          height: bracketSize,
          borderTop: `${bracketWidth} solid ${bracketColor}`,
          borderLeft: `${bracketWidth} solid ${bracketColor}`,
        }}
        _after={{
          content: '""',
          position: 'absolute',
          top: '-1px',
          right: '-1px',
          width: bracketSize,
          height: bracketSize,
          borderTop: `${bracketWidth} solid ${bracketColor}`,
          borderRight: `${bracketWidth} solid ${bracketColor}`,
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
          width: bracketSize,
          height: bracketSize,
          borderBottom: `${bracketWidth} solid ${bracketColor}`,
          borderLeft: `${bracketWidth} solid ${bracketColor}`,
        }}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          right: '-1px',
          width: bracketSize,
          height: bracketSize,
          borderBottom: `${bracketWidth} solid ${bracketColor}`,
          borderRight: `${bracketWidth} solid ${bracketColor}`,
        }}
      />

      {/* Panel body */}
      <Box
        borderRadius="2px"
        overflow="hidden"
        border="1px solid"
        borderColor={
          isSubtle
            ? isDark ? 'rgba(16,185,129,0.08)' : 'rgba(14,116,144,0.14)'
            : isDark ? ComponentsTheme.panel.border.dark : ComponentsTheme.panel.border.light
        }
        bg={isDark ? ComponentsTheme.panel.bg.dark : ComponentsTheme.panel.bg.light}
        boxShadow={
          isSubtle
            ? isDark
              ? '0 6px 20px rgba(0,0,0,0.32)'
              : '0 4px 12px rgba(15,39,55,0.06)'
            : isDark
              ? '0 0 30px rgba(16,185,129,0.04), 0 8px 32px rgba(0,0,0,0.45)'
              : '0 6px 18px rgba(15,39,55,0.08)'
        }
        position="relative"
        _after={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark && !isSubtle
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
          background={
            isSubtle
              ? `linear-gradient(90deg, ${isDark ? 'rgba(16,185,129,0.45)' : 'rgba(14,116,144,0.38)'}, transparent 55%)`
              : `linear-gradient(90deg, ${isDark ? '#10B981' : '#0E7490'}, transparent 70%)`
          }
          zIndex={2}
        />

        {/* Scan-line sweep */}
        {isDark && !isSubtle && (
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
          borderColor={
            isSubtle
              ? isDark ? 'rgba(16,185,129,0.07)' : 'rgba(14,116,144,0.11)'
              : isDark ? 'rgba(16,185,129,0.1)' : 'rgba(14,116,144,0.13)'
          }
          bg={
            isSubtle
              ? isDark ? 'rgba(16,185,129,0.025)' : 'rgba(14,116,144,0.035)'
              : isDark ? ComponentsTheme.panel.heading.bg.dark : ComponentsTheme.panel.heading.bg.light
          }
          position="relative"
          zIndex={1}
        >
          {icon && (
            <Box color={isDark ? '#10B981' : '#0E7490'} display="flex">
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
  variant: 'default',
}

Panel.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node, PropTypes.string]).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  boxProps: PropTypes.object,
  variant: PropTypes.oneOf(['default', 'subtle']),
}

export default Panel
