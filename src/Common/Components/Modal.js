import {
  Button,
  Modal as ChakraModal,
  ModalBody, ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const Modal = ({ isOpen, onClose, overlay, title, submitLabel, onSubmit, children}) => {
  const { t } = useTranslation()
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>
      {overlay && <ModalOverlay />}
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button variant='ghost' mr={3} onClick={onClose}>
            {t('actions:Cancel')}
          </Button>
          {onSubmit && (
            <Button colorScheme="green" onClick={onSubmit}>{submitLabel}</Button>
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
