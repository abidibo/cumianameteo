import { Box, Flex, FormControl, SimpleGrid } from '@chakra-ui/react'
import { DatePickerInput } from 'chakra-datetime-picker'
import dayjs from 'dayjs'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Panel from '@Common/Components/Panel'
import BaseLayout from '@Common/Layouts/BaseLayout'
import { withLoader } from '@Common/Utils/HOF'
import config from '@Config'
import DataHistorySingleChart from '@Realtime/Components/DataHistorySingleChart'
import Statistics from '@Realtime/Components/Statistics'
import { useHistoryDataQuery } from '@Realtime/Services/Api'
import { toast } from '@Common/Components/Toast'

const DFT_FROM = parseInt(dayjs().subtract(1, 'months').valueOf() / 1e3)
const DFT_TO = parseInt(dayjs().valueOf() / 1e3)

const DataHistoryView = () => {
  const { t } = useTranslation()
  const [fromDate, setFromDate] = useState(DFT_FROM)
  const [toDate, setToDate] = useState(DFT_TO)
  const [extremes, setExtremes] = useState([DFT_FROM, DFT_TO])
  const [controllingChart, setControllingChart] = useState(null)
  const chartsRef = useRef({})

  const createRefs = useCallback(
    (id) => (el) => {
      chartsRef.current[id] = el
    },
    [chartsRef],
  )

  const { data, isFetching } = useHistoryDataQuery({
    from: fromDate,
    to: toDate,
  })

  const handleChangeFrom = (_, d) => {
    setFromDate(parseInt(d.valueOf() / 1e3))
  }

  const handleChangeTo = (_, d) => {
    if (fromDate && fromDate * 1e3 > d.valueOf()) {
      toast({
        title: t(`realtime:errors.ToDateMinorThanFromDate`),
        description: t(`realtime:errors.ToDateMinorThanFromDateErrorDescription`),
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
    } else {
      setToDate(parseInt(d.valueOf() / 1e3))
    }
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
                format='LL'
              />
            </FormControl>
            <FormControl>
              <DatePickerInput
                allowClear={false}
                inputProps={{ placeholder: t('realtime:ui.To') }}
                onChange={handleChangeTo}
                value={toDate * 1e3}
                format='LL'
              />
            </FormControl>
          </SimpleGrid>
        </Panel>
        {withLoader(
          () => (
            <Box marginTop="2rem">
              <Panel
                title={
                  <Flex alignItems={'center'} justifyContent="space-between" width="100%">
                    <span>{t('realtime:ui.Temperature')}</span>
                    <small>
                      {dayjs(extremes[0] * 1e3).format('YYYY-MM-DD HH:mm:ss')} /{' '}
                      {dayjs(extremes[1] * 1e3).format('YYYY-MM-DD HH:mm:ss')}
                    </small>
                  </Flex>
                }
                boxProps={{ marginBottom: 4 }}
              >
                <Statistics data={data} keyName="temperature" unit="°C" />
                <DataHistorySingleChart
                  keyName={'temperature'}
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
                  extremes={extremes}
                  setExtremes={setExtremes}
                  controllingChart={controllingChart}
                  setControllingChart={setControllingChart}
                  innerRef={createRefs('temperature')}
                  chartsRef={chartsRef}
                />
              </Panel>

              <Panel
                title={
                  <Flex alignItems={'center'} justifyContent="space-between" width="100%">
                    <span>{t('realtime:ui.Pressure')}</span>
                    <small>
                      {dayjs(extremes[0] * 1e3).format('YYYY-MM-DD HH:mm:ss')} /{' '}
                      {dayjs(extremes[1] * 1e3).format('YYYY-MM-DD HH:mm:ss')}
                    </small>
                  </Flex>
                }
                boxProps={{ marginBottom: 4 }}
              >
                <Statistics data={data} keyName="pressure" unit="hPa" />
                <DataHistorySingleChart
                  keyName={'pressure'}
                  label={t('realtime:ui.Pressure')}
                  labelMean={t('realtime:ui.MeanPressure')}
                  labelMin={t('realtime:ui.MinPressure')}
                  labelMax={t('realtime:ui.MaxPressure')}
                  unit={'hPa'}
                  colorMean={config.ui.chartColors[0]}
                  colorMin={config.ui.chartColors[1]}
                  colorMax={config.ui.chartColors[8]}
                  dataMean={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.pressure_mean)]
                  })}
                  dataMin={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.pressure_min)]
                  })}
                  dataMax={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.pressure_max)]
                  })}
                  extremes={extremes}
                  setExtremes={setExtremes}
                  controllingChart={controllingChart}
                  setControllingChart={setControllingChart}
                  innerRef={createRefs('pressure')}
                  chartsRef={chartsRef}
                />
              </Panel>

              <Panel
                title={
                  <Flex alignItems={'center'} justifyContent="space-between" width="100%">
                    <span>{t('realtime:ui.RelativeHumidity')}</span>
                    <small>
                      {dayjs(extremes[0] * 1e3).format('YYYY-MM-DD HH:mm:ss')} /{' '}
                      {dayjs(extremes[1] * 1e3).format('YYYY-MM-DD HH:mm:ss')}
                    </small>
                  </Flex>
                }
                boxProps={{ marginBottom: 4 }}
              >
                <Statistics data={data} keyName="relative_humidity" unit="%" />
                <DataHistorySingleChart
                  keyName={'relative_humidity'}
                  label={t('realtime:ui.RelativeHumidity')}
                  labelMean={t('realtime:ui.MeanRelativeHumidity')}
                  labelMin={t('realtime:ui.MinRelativeHumidity')}
                  labelMax={t('realtime:ui.MaxRelativeHumidity')}
                  unit={'%'}
                  colorMean={config.ui.chartColors[0]}
                  colorMin={config.ui.chartColors[1]}
                  colorMax={config.ui.chartColors[8]}
                  dataMean={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.relative_humidity_mean)]
                  })}
                  dataMin={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.relative_humidity_min)]
                  })}
                  dataMax={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.relative_humidity_max)]
                  })}
                  extremes={extremes}
                  setExtremes={setExtremes}
                  controllingChart={controllingChart}
                  setControllingChart={setControllingChart}
                  innerRef={createRefs('relative_humidity')}
                  chartsRef={chartsRef}
                />
              </Panel>

              <Panel
                title={
                  <Flex alignItems={'center'} justifyContent="space-between" width="100%">
                    <span>{t('realtime:ui.Rain')}</span>
                    <small>
                      {dayjs(extremes[0] * 1e3).format('YYYY-MM-DD HH:mm:ss')} /{' '}
                      {dayjs(extremes[1] * 1e3).format('YYYY-MM-DD HH:mm:ss')}
                    </small>
                  </Flex>
                }
              >
                {<Statistics data={data} keyName="rain" unit="mm" useSameKey showTotal />}
                <DataHistorySingleChart
                  keyName={'rain'}
                  label={t('realtime:ui.Rain')}
                  labelMean={t('realtime:ui.Rain')}
                  unit={'mm'}
                  colorMean={config.ui.chartColors[1]}
                  dataMean={data.map((item) => {
                    return [dayjs(item.date).valueOf(), parseFloat(item.rain)]
                  })}
                  extremes={extremes}
                  setExtremes={setExtremes}
                  controllingChart={controllingChart}
                  setControllingChart={setControllingChart}
                  innerRef={createRefs('rain')}
                  chartsRef={chartsRef}
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
