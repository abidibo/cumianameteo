import {
  Button,
  Modal as ChakraModal,
  ModalBody, ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
} from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import ComponentsTheme from '@Theme/Components'

const Modal = ({ isOpen, onClose, overlay, title, submitLabel, onSubmit, children}) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>
      {overlay && <ModalOverlay bg={isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)'} />}
      <ModalContent
        borderRadius="2px"
        bg={isDark ? '#0d1420' : ComponentsTheme.panel.bg.light}
        border="1px solid"
        borderColor={isDark ? 'rgba(16,185,129,0.15)' : ComponentsTheme.panel.border.light}
        boxShadow={isDark ? '0 8px 32px rgba(0,0,0,0.6)' : '0 12px 36px rgba(15,39,55,0.16)'}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${isDark ? '#10B981' : '#0E7490'}, transparent 60%)`,
        }}
        overflow="hidden"
      >
        <ModalHeader
          fontFamily={ComponentsTheme.fonts.heading}
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="widest"
          color={isDark ? '#10B981' : '#0E7490'}
          bg={isDark ? 'rgba(16,185,129,0.04)' : ComponentsTheme.panel.heading.bg.light}
          borderBottom="1px solid"
          borderColor={isDark ? 'rgba(16,185,129,0.1)' : 'rgba(14,116,144,0.13)'}
          py={3}
        >
          {title}
        </ModalHeader>
        <ModalBody py={5}>{children}</ModalBody>
        <ModalFooter
          borderTop="1px solid"
          borderColor={isDark ? 'rgba(16,185,129,0.08)' : 'rgba(14,116,144,0.13)'}
        >
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            borderRadius="2px"
            fontFamily={ComponentsTheme.fonts.data}
            fontSize="xs"
            letterSpacing="wider"
            textTransform="uppercase"
            color={isDark ? 'gray.400' : '#526575'}
            _hover={{ bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(14,116,144,0.08)' }}
          >
            {t('actions.Cancel')}
          </Button>
          {onSubmit && (
            <Button
              onClick={onSubmit}
              borderRadius="2px"
              bg={isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)'}
              color={isDark ? '#F59E0B' : '#D97706'}
              border="1px solid"
              borderColor={isDark ? 'rgba(245,158,11,0.3)' : 'rgba(217,119,6,0.3)'}
              fontFamily={ComponentsTheme.fonts.data}
              fontSize="xs"
              letterSpacing="wider"
              textTransform="uppercase"
              _hover={{
                bg: isDark ? 'rgba(245,158,11,0.25)' : 'rgba(245,158,11,0.2)',
                boxShadow: isDark ? '0 0 12px rgba(245,158,11,0.2)' : '0 0 8px rgba(245,158,11,0.15)',
              }}
            >
              {submitLabel}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  overlay: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default Modal
