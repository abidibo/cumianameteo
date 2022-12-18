import PropTypes from 'prop-types'
import Modal from '@Common/Components/Modal'
import { useTranslation } from 'react-i18next'
import { Box } from '@chakra-ui/react'

const SettingsModal = ({ onClose }) => {
  const { t } = useTranslation()

  const handleSubmit = () => {}

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t('ui.Settings')}
      onSubmit={handleSubmit}
      submitLabel={t('actions.Save')}
    >
      <Box>
        WIP
      </Box>
    </Modal>
  )
}

SettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default SettingsModal
