import { Flex, Spinner } from '@chakra-ui/react'
import { type } from 'ramda'

export const withLoader = (Component, condition, mode, spinnerProps = {}) => {
  const props = mode === 'overlay' ? { overlay: true } : { minH: spinnerProps.minHeight || '200px' }
  return condition ? (
    <Flex align="center" justify="center" {...props}>
      <Spinner
        color="#10B981"
        thickness="2px"
        speed="1s"
        emptyColor="rgba(16,185,129,0.1)"
        {...spinnerProps}
      />
    </Flex>
  ) : type(Component) === 'Function' ? (
    Component()
  ) : (
    Component
  )
}
