import LocalStorage from './LocalStorage'

const storageFactory = () => {
  if (import.meta.env.VITE_STORAGE === 'localStorage') {
    return LocalStorage
  }
}

export default storageFactory
