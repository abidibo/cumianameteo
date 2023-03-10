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
    <Box background={ComponentsTheme.chart.bg[colorMode]}>
      <TableContainer>
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th>{t('realtime:ui.Min')}</Th>
              <Th>{t('realtime:ui.Max')}</Th>
              <Th>{t('realtime:ui.Mean')}</Th>
              {showTotal && <Th>{t('realtime:ui.Total')}</Th>}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                {min} {unit} / {minDate}
              </Td>
              <Td>
                {max} {unit} / {maxDate}
              </Td>
              <Td>
                {mean} {unit}
              </Td>
              {showTotal && (
                <Td>
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
