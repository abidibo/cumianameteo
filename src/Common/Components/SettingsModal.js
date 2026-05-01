import PropTypes from 'prop-types'
import Modal from '@Common/Components/Modal'
import { useTranslation } from 'react-i18next'
import { Box, Select, useColorMode } from '@chakra-ui/react'
import { useForm } from '@Common/Utils/Hooks'
import { setStateFromEvent } from '@Common/Utils/Events'
import EventDispatcher from '@Common/Services/EventDispatcher'
import ComponentsTheme from '@Theme/Components'
import Field from './Field'

const SettingsModal = ({ onClose }) => {
  const { t, i18n } = useTranslation()
  const { colorMode, setColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { fields, setField } = useForm({ locale: i18n.language, colorMode })

  const handleSubmit = () => {
    i18n.changeLanguage(fields.locale)
    EventDispatcher.emit('localeChange', fields.locale)
    setColorMode(fields.colorMode)
    onClose()
  }

  const selectStyles = {
    borderRadius: '2px',
    fontFamily: ComponentsTheme.fonts.data,
    fontSize: 'sm',
    bg: isDark ? 'rgba(8,12,20,0.8)' : 'white',
    borderColor: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.15)',
    color: isDark ? 'gray.200' : 'gray.700',
    _hover: { borderColor: isDark ? 'rgba(16,185,129,0.4)' : 'rgba(0,0,0,0.3)' },
    _focus: {
      borderColor: isDark ? '#10B981' : '#059669',
      boxShadow: isDark ? '0 0 0 1px rgba(16,185,129,0.3)' : '0 0 0 1px rgba(5,150,105,0.3)',
    },
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
          <Select value={fields.locale} onChange={setStateFromEvent(setField('locale'))} {...selectStyles}>
            <option value={'it'}>{t('common:ui.Italian')}</option>
            <option value={'en'}>{t('common:ui.English')}</option>
          </Select>
        </Field>
        <Field isRequired label={t('ui.Theme')}>
          <Select value={fields.colorMode} onChange={setStateFromEvent(setField('colorMode'))} {...selectStyles}>
            <option value={'light'}>{t('common:ui.Light')}</option>
            <option value={'dark'}>{t('common:ui.Dark')}</option>
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
