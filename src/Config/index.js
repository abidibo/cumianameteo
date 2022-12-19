const config = {
  station: {
    slug: 'cumiana',
    webcamId: 28,
    webcamBaseUrl: 'https://cumiana.cam.torinometeo.org/24h/28/',
  },
  logger: {
    // eslint-disable-next-line no-undef
    level: process.env.REACT_APP_LOGGER_LEVEL, // DEBUG, INFO, WARNING, ERROR
  },
  // eslint-disable-next-line no-undef
  apiBasePath: process.env.REACT_APP_API_BASE_PATH,
  urls: {
    home: '/',
  },
  ui: {
    chartColors: [
      '#FDB833',
      '#1789FC',
      '#B1740F',
      '#296EB4',
      '#000044',
      '#96031A',
      '#6D676E',
      '#EBEBD3',
    ]
  }
}

export default config

export const makePath = (selector, context) => {
  const parts = selector.split('.')
  parts.pop() // remove leaf
  const parents = []
  parts.reduce((acc, curr) => {
    if (acc[curr]?.base) {
      parents.push(acc[curr]?.base)
    }
    return acc ? acc[curr] : null
  }, config.urls)

  let path = selector.split('.').reduce((acc, curr) => (acc ? acc[curr] : null), config.urls)

  // compose path
  path = parents.join('').replace(/\*/g, '') + (path ? `${path}` : '')

  // apply context
  if (context) {
    Object.keys(context).forEach((key) => {
      path = path.replace(`:${key}`, context[key])
    })
  }

  return path
}
