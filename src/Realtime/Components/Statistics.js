import { Box, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { sum } from 'ramda'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { round } from '@Common/Utils/Numbers'
import ComponentsTheme from '@Theme/Components'

const Statistics = ({ data, keyName, unit, useSameKey, showTotal, extremes }) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const inExtremes = useCallback(
    (item) => dayjs(item.date).valueOf() >= extremes[0] * 1e3 && dayjs(item.date) <= extremes[1] * 1e3,
    extremes,
  )

  let min, minDate, max, maxDate, mean, total
  const meanItems = []
  data.filter(inExtremes).forEach((item) => {
    const itemMin = useSameKey ? parseFloat(item[keyName]) : parseFloat(item[`${keyName}_min`])
    const itemMax = useSameKey ? parseFloat(item[keyName]) : parseFloat(item[`${keyName}_max`])
    const itemMean = useSameKey ? parseFloat(item[keyName]) : parseFloat(item[`${keyName}_mean`])
    if (min === undefined || itemMin < min) {
      minDate = item.date
      min = itemMin
    }
    if (max === undefined || itemMax > max) {
      maxDate = item.date
      max = itemMax
    }
    if (!isNaN(itemMean)) {
      meanItems.push(itemMean)
    }
  })
  total = round(sum(meanItems), 1)
  mean = round(total / meanItems.length, 1)

  return (
    <Box
      background={ComponentsTheme.chart.bg[colorMode]}
      fontFamily={ComponentsTheme.fonts.data}
      fontSize="12px"
    >
      <TableContainer>
        <Table variant="unstyled" size="sm">
          <Thead>
            <Tr borderBottom="1px solid" borderColor={isDark ? 'rgba(16,185,129,0.1)' : 'rgba(14,116,144,0.13)'}>
              <Th fontFamily={ComponentsTheme.fonts.heading} letterSpacing="widest" textTransform="uppercase" color={isDark ? '#10B981' : '#0E7490'} fontSize="10px">{t('realtime:ui.Min')}</Th>
              <Th fontFamily={ComponentsTheme.fonts.heading} letterSpacing="widest" textTransform="uppercase" color={isDark ? '#10B981' : '#0E7490'} fontSize="10px">{t('realtime:ui.Max')}</Th>
              <Th fontFamily={ComponentsTheme.fonts.heading} letterSpacing="widest" textTransform="uppercase" color={isDark ? '#10B981' : '#0E7490'} fontSize="10px">{t('realtime:ui.Mean')}</Th>
              {showTotal && <Th fontFamily={ComponentsTheme.fonts.heading} letterSpacing="widest" textTransform="uppercase" color={isDark ? '#10B981' : '#0E7490'} fontSize="10px">{t('realtime:ui.Total')}</Th>}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td color={isDark ? 'gray.300' : '#10202C'}>
                {min} {unit} / {minDate}
              </Td>
              <Td color={isDark ? 'gray.300' : '#10202C'}>
                {max} {unit} / {maxDate}
              </Td>
              <Td color={isDark ? 'gray.300' : '#10202C'}>
                {mean} {unit}
              </Td>
              {showTotal && (
                <Td color={isDark ? 'gray.300' : '#10202C'}>
                  {total} {unit}
                </Td>
              )}
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

Statistics.propTypes = {
  data: PropTypes.array,
  keyName: PropTypes.string,
  unit: PropTypes.string,
  useSameKey: PropTypes.bool,
  showTotal: PropTypes.bool,
  extremes: PropTypes.arrayOf(PropTypes.number),
}

export default Statistics
