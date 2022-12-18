import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { setBreadcrumbs } from '@Core/Redux/Ui'
import * as R from 'ramda'
import { history } from '@Core/Redux/Store'
import { makePath } from '@Config'
import { valIfUndefined } from './Ramda'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

/**
 * Set page breadcrumbs in the redux store (which are retrieved from the BaseLayout)
 *
 * @param {Array} breadcrumbs - the breadcrumbs definition
 * @param {Boolean} cond - a condition which should be met in order to actually set the breadcrumbs
 * @param {Array} deps - any breadcrumbs deps, considered in the useEffect hook to update breadcrumbs
 */
export const useBreadcrumbs = (breadcrumbs, cond = true, deps = []) => {
  const dispatch = useDispatch()
  React.useEffect(() => {
    if (cond) {
      dispatch(setBreadcrumbs(breadcrumbs))
    }
  }, [cond, ...deps])
}

/**
 * Use form hook
 * Utility to manage fields, errors and uptade functions
 * Return { fields, setFields, setField, errors, setErrors }, where:
 * - fields: current value fo all fields
 * - setFields: setter for all fields
 * - setField: setter for a single field, i.e. setField('myField')(value)
 * - errors: field errors
 * - setErrors: setter for the errors map
 *
 * @param {Object} initFields - initial values for all fields
 * @param {Function} [onSetField] - optional callback to call when updating a field
 */
export const useForm = (initFields, onSetField = null) => {
  const [fields, setFields] = React.useState(initFields)
  const [errors, setErrors] = React.useState({})
  const clearErrors = () => setErrors({})
  const setField = (field, type, dft) => (value) => {
    switch (type) {
      case 'int':
        value = R.either(R.isEmpty, R.isNil)(value) ? valIfUndefined(null, dft) : parseInt(value)
        break
      case 'float':
        value = R.either(R.isEmpty, R.isNil)(value) ? valIfUndefined(null, dft) : parseFloat(value)
        break
      case 'array':
        value = R.isNil(value) ? valIfUndefined([], dft) : value
        break
      default:
        value = R.isEmpty(value) ? valIfUndefined('', dft) : value
    }

    setFields({ ...fields, [field]: value })
    onSetField && onSetField(field, value)
  }

  return { fields, setFields, setField, errors, setErrors, clearErrors }
}

/**
 * Use debounce hook
 * Utility to add a debounce to any value change
 *
 * Usage:
 * const [filterName, setFilterName] = React.useState('')
 * const debouncedName = useDebounce(filterName, 300)
 *
 * @param {Any} value - value to be debounces
 * @param {Number} delay - debounce interval in ms
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Use prop did update hook
 * Utility to check for a prop did update event
 *
 * @param {Function} effect - function called when the update event fires
 * @param {Any} prop - property to check for update
 */
export const usePropDidUpdate = (effect, prop) => {
  const prev = React.useRef(prop)

  React.useEffect(() => {
    const unmountHandler = effect(prev.current, prop)
    prev.current = prop
    return unmountHandler
  }, [prop])
}

/**
 * Use did update hook
 * Utility to check for component di update event
 *
 * @param {Function} effect - function to call when the event fires
 * @param {Array} deps - dependencies to watch for changes
 */
export const useDidUpdate = (effect, deps) => {
  const didMount = React.useRef(false)

  React.useEffect(() => {
    if (didMount.current) {
      effect()
    } else {
      didMount.current = true
    }
  }, deps)
}

/**
 * Use page not found hook
 * Utility to redirect the user to a 404 page if condition is met
 *
 * @param {Boolean} condition - condition to watch for redirect
 * @param {Array} deps - list of deps to check for change (useEffect)
 */
export const usePageNotFoundRedirect = (condition, deps) => {
  React.useEffect(() => {
    if (condition) history.push(makePath('pageNotFound'))
  }, deps)
}

export const useDeleteConfirm = (handleConfirm) => {
  const { t } = useTranslation()
  const [state, setState] = useState({
    isOpen: false,
    payload: null,
    title: t('actions.Delete'),
    text: t('ui.ConfirmDeleteText'),
  })

  const handleOpen = React.useCallback(R.compose(setState, R.assoc('isOpen', true), R.mergeRight(state)), [setState])
  const handleClose = R.compose(
    setState,
    R.always({ isOpen: false, payload: null, title: t('actions.Delete'), text: t('ui.ConfirmDeleteText') }),
  )

  const ConfirmDialog = (
    <AlertDialog isOpen={state.isOpen} onClose={handleClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {state.title}
          </AlertDialogHeader>
          <AlertDialogBody>{state.text}</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={handleClose}>{t('actions.Cancel')}</Button>
            <Button colorScheme="red" onClick={R.compose(handleClose, handleConfirm, R.always(state.payload))} ml={3}>
              {t('actions.Delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )

  return { handleOpen, handleClose, ConfirmDialog }
}
