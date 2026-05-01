const config = {
  station: {
    slug: 'cumiana',
    webcamId: 28,
    webcamBaseUrl: 'https://cumiana.cam.torinometeo.org/24h/28/',
  },
  logger: {
    level: import.meta.env.VITE_LOGGER_LEVEL, // DEBUG, INFO, WARNING, ERROR
  },
  apiBasePath: import.meta.env.VITE_API_BASE_PATH,
  urls: {
    home: '/',
    forecast: '/forecast',
    dataHistory: '/data/history',
  },
  ui: {
    chartColors: [
      '#F59E0B',
      '#06B6D4',
      '#10B981',
      '#3B82F6',
      '#8B5CF6',
      '#EF4444',
      '#EC4899',
      '#6366F1',
      '#F97316',
    ],
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
