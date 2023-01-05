import { Box, FormControl, SimpleGrid } from '@chakra-ui/react'
import { DatePickerInput } from 'chakra-datetime-picker'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Panel from '@Common/Components/Panel'
import BaseLayout from '@Common/Layouts/BaseLayout'
import { withLoader } from '@Common/Utils/HOF'
import config from '@Config'
import DataHistorySingleChart from '@Realtime/Components/DataHistorySingleChart'
import Statistics from '@Realtime/Components/Statistics'
import { useHistoryDataQuery } from '@Realtime/Services/Api'

const DataHistoryView = () => {
  const { t } = useTranslation()
  const [fromDate, setFromDate] = useState(parseInt(dayjs().subtract(1, 'months').valueOf() / 1e3))
  const [toDate, setToDate] = useState(parseInt(dayjs().valueOf() / 1e3))

  const { data, isFetching } = useHistoryDataQuery({
    from: fromDate,
    to: toDate,
  })

  const handleChangeFrom = (_, d) => {
    setFromDate(parseInt(d.valueOf() / 1e3))
  }

  const handleChangeTo = (_, d) => {
    setToDate(parseInt(d.valueOf() / 1e3))
  }

  return (
    <BaseLayout>
      <Box p={5} gap="1rem">
        <Panel title={t('ui.DataHistory')}>
          <SimpleGrid columns={{ sm: 1, md: 2, lg: 2 }} spacing={4} marginTop="1rem">
            <FormControl>
              <DatePickerInput
                allowClear={false}
                inputProps={{ placeholder: t('realtime:ui.From') }}
                onChange={handleChangeFrom}
                value={fromDate * 1e3}
              />
            </FormControl>
            <FormControl>
              <DatePickerInput
                allowClear={false}
                inputProps={{ placeholder: t('realtime:ui.To') }}
                onChange={handleChangeTo}
                value={toDate * 1e3}
              />
            </FormControl>
          </SimpleGrid>
        </Panel>
        {withLoader(
          () => (
            <Box marginTop="2rem">
              <Panel title={t('realtime:ui.Temperature')}>
                <Statistics data={data} keyName="temperature" unit="°C" />
                <DataHistorySingleChart
                  label={t('realtime:ui.Temperature')}
                  labelMean={t('realtime:ui.MeanTemperature')}
                  labelMin={t('realtime:ui.MinTemperature')}
                  labelMax={t('realtime:ui.MaxTemperature')}
                  unit={'°C'}
                  colorMean={config.ui.chartColors[0]}
                  colorMin={config.ui.chartColors[1]}
                  colorMax={config.ui.chartColors[8]}
                  dataMean={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.temperature_mean)]
                  })}
                  dataMin={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.temperature_min)]
                  })}
                  dataMax={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.temperature_max)]
                  })}
                />
              </Panel>
            </Box>
          ),
          isFetching,
        )}
      </Box>
    </BaseLayout>
  )
}

export default DataHistoryView
