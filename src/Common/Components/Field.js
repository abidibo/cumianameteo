import PropTypes from 'prop-types'
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const Field = ({ isRequired, error, label, children }) => {
  const { t } = useTranslation()
  return (
    <FormControl isRequired={isRequired} isInvalid={error} mb="1rem">
      <FormLabel>{label}</FormLabel>
      {children}
      <FormErrorMessage>{t(error)}</FormErrorMessage>
    </FormControl>
  )
}

Field.propTypes = {
  isRequired: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default Field
