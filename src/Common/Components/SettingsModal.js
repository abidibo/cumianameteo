import PropTypes from 'prop-types'
import Modal from '@Common/Components/Modal'
import { useTranslation } from 'react-i18next'
import { Box, Select } from '@chakra-ui/react'
import { useForm } from '@Common/Utils/Hooks'
import { setStateFromEvent } from '@Common/Utils/Events'
import Field from './Field'

const SettingsModal = ({ onClose }) => {
  const { t, i18n } = useTranslation()
  const { fields, setField } = useForm({ locale: i18n.language })

  const handleSubmit = () => {
    i18n.changeLanguage(fields.locale)
    onClose()
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t('ui.Settings')}
      onSubmit={handleSubmit}
      submitLabel={t('actions.Save')}
    >
      <Box>
        <Field isRequired label={t('ui.Locale')}>
          <Select value={fields.locale} onChange={setStateFromEvent(setField('locale'))}>
            <option value={'it'}>{t('common:ui.Italian')}</option>
            <option value={'en'}>{t('common:ui.English')}</option>
          </Select>
        </Field>
      </Box>
    </Modal>
  )
}

SettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default SettingsModal
