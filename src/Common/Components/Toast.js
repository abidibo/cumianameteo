import { createStandaloneToast } from "@chakra-ui/react"
import theme from '@Theme'

const { ToastContainer, toast } = createStandaloneToast({ theme })

const Toast = () => {
  return <ToastContainer />
}

export default Toast
export { toast }
