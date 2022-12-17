import LocalStorage from './LocalStorage'

const storageFactory = () => {
  if (process.env.REACT_APP_STORAGE === 'localStorage') {
    return LocalStorage
  }
}

export default storageFactory
