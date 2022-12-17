import config from '../../Config';


const levels = {
  DEBUG: { value: 1, func: 'log', icon: '' },
  INFO: { value: 2, func: 'info', icon: '😎' },
  WARNING: { value: 3, func: 'warn', icon: '' },
  ERROR: { value: 4, func: 'error', icon: '' },
}
const shouldLog = (level) => levels[config.logger.level].value <= levels[level].value
const log = (level, ...args) =>
  //eslint-disable-next-line
  console[levels[level].func](`${levels[level].icon ? levels[level].icon + ' ' : ''}[OTA-UI]`, ...args)

const Logger = {
  debug: (...args) => (shouldLog('DEBUG') ? log('DEBUG', ...args) : null),
  info: (...args) => (shouldLog('INFO') ? log('INFO', ...args) : null),
  warning: (...args) => (shouldLog('WARNING') ? log('WARNING', ...args) : null),
  error: (...args) => (shouldLog('ERROR') ? log('ERROR', ...args) : null),
}

export default Logger
