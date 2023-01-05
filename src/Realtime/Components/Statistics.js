import { Box, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import PropTypes from 'prop-types'
import { defaultTo } from 'ramda'
import { useTranslation } from 'react-i18next'

import { round } from '@Common/Utils/Numbers'
import ComponentsTheme from '@Theme/Components'

const Statistics = ({ data, keyName, unit }) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()

  let min, minDate, max, maxDate, mean
  data.forEach((item) => {
    const itemMin = parseFloat(item[`${keyName}_min`])
    const itemMax = parseFloat(item[`${keyName}_max`])
    if (min === undefined || itemMin < min) {
      minDate = item.date
      min = itemMin
    }
    if (max === undefined || itemMax > max) {
      maxDate = item.date
      max = itemMax
    }
    mean = defaultTo(0, mean) + parseFloat(item[`${keyName}_mean`])
  })
  mean = round(mean / data.length, 1)

  return (
    <Box background={ComponentsTheme.chart.bg[colorMode]}>
      <TableContainer>
        <Table variant="simple" size='sm'>
          <TableCaption>{t('realtime:ui.Statistics')}</TableCaption>
          <Thead>
            <Tr>
              <Th>{t('realtime:ui.Min')}</Th>
              <Th>{t('realtime:ui.Max')}</Th>
              <Th>{t('realtime:ui.Mean')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{min} {unit} / {minDate}</Td>
              <Td>{max} {unit} / { maxDate}</Td>
              <Td>{mean} {unit}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

Statistics.propTypes = {
  data: PropTypes.object,
  keyName: PropTypes.string,
  unit: PropTypes.string,
}

export default Statistics
