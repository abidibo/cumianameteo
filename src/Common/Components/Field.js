import PropTypes from 'prop-types'
import { FormControl, FormErrorMessage, FormLabel, useColorMode } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import ComponentsTheme from '@Theme/Components'

const Field = ({ isRequired, error, label, children }) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <FormControl isRequired={isRequired} isInvalid={error} mb="1rem">
      <FormLabel
        fontFamily={ComponentsTheme.fonts.heading}
        fontSize="xs"
        textTransform="uppercase"
        letterSpacing="widest"
        fontWeight="600"
        color={isDark ? '#10B981' : '#059669'}
      >
        {label}
      </FormLabel>
      {children}
      <FormErrorMessage fontFamily={ComponentsTheme.fonts.data} fontSize="xs">
        {t(error)}
      </FormErrorMessage>
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
