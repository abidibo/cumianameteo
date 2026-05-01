import { Box, Flex, FormControl, FormLabel, Input, SimpleGrid, Text, useColorMode } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { WiBarometer, WiHumidity, WiRain, WiThermometer } from 'react-icons/wi'

import Panel from '@Common/Components/Panel'
import { toast } from '@Common/Components/Toast'
import BaseLayout from '@Common/Layouts/BaseLayout'
import { withLoader } from '@Common/Utils/HOF'
import config from '@Config'
import DataHistorySingleChart from '@Realtime/Components/DataHistorySingleChart'
import Statistics from '@Realtime/Components/Statistics'
import { useHistoryDataQuery } from '@Realtime/Services/Api'
import ComponentsTheme from '@Theme/Components'

const DFT_FROM = parseInt(dayjs().subtract(1, 'months').valueOf() / 1e3)
const DFT_TO = parseInt(dayjs().valueOf() / 1e3)

const DataHistoryView = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
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
    if (toDate && toDate * 1e3 < d.valueOf()) {
      toast({
        title: t(`realtime:errors.FromDateGreaterThanToDate`),
        description: t(`realtime:errors.FromDateGreaterThanToDateErrorDescription`),
        status: 'error',
        duration: 10000,
        isClosable: true,
      })
    } else {
      setFromDate(parseInt(d.valueOf() / 1e3))
      setExtremes([parseInt(d.valueOf() / 1e3), toDate])
    }
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
      setExtremes([fromDate, parseInt(d.valueOf() / 1e3)])
    }
  }

  const inputStyles = {
    borderRadius: '2px',
    fontFamily: ComponentsTheme.fonts.data,
    fontSize: 'sm',
    bg: isDark ? 'rgba(8,12,20,0.8)' : 'white',
    borderColor: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.15)',
    color: isDark ? 'gray.200' : 'gray.700',
    _hover: { borderColor: isDark ? 'rgba(16,185,129,0.4)' : 'rgba(0,0,0,0.3)' },
    _focus: {
      borderColor: isDark ? '#10B981' : '#059669',
      boxShadow: isDark ? '0 0 0 1px rgba(16,185,129,0.3)' : '0 0 0 1px rgba(5,150,105,0.3)',
    },
  }

  const labelStyles = {
    fontFamily: ComponentsTheme.fonts.heading,
    fontSize: 'xs',
    textTransform: 'uppercase',
    letterSpacing: 'widest',
    fontWeight: '600',
    color: isDark ? '#10B981' : '#059669',
  }

  const dateRangeLabel = (
    <Text
      as="span"
      fontFamily={ComponentsTheme.fonts.data}
      fontSize="xs"
      color={isDark ? 'gray.500' : 'gray.400'}
      letterSpacing="wider"
    >
      {dayjs(extremes[0] * 1e3).format('YYYY-MM-DD HH:mm')} / {dayjs(extremes[1] * 1e3).format('YYYY-MM-DD HH:mm')}
    </Text>
  )

  return (
    <BaseLayout>
      <Box p={5} gap="1rem">
        <Panel title={t('ui.DataHistory')}>
          <Box
            display="flex"
            alignItems="center"
            gap={3}
            p={3}
            borderRadius="2px"
            bg={isDark ? 'rgba(16,185,129,0.06)' : 'rgba(5,150,105,0.06)'}
            border="1px solid"
            borderColor={isDark ? 'rgba(16,185,129,0.12)' : 'rgba(5,150,105,0.12)'}
            mb={4}
          >
            <Box color={isDark ? '#10B981' : '#059669'} flexShrink={0}>
              <IoInformationCircleOutline size={18} />
            </Box>
            <Text
              fontFamily={ComponentsTheme.fonts.data}
              fontSize="xs"
              letterSpacing="wider"
              color={isDark ? 'gray.400' : 'gray.600'}
            >
              {t('realtime:ui.DataCollectedFrom')}
            </Text>
          </Box>
          <SimpleGrid columns={{ sm: 1, md: 2, lg: 2 }} spacing={4}>
            <FormControl>
              <FormLabel {...labelStyles}>{t('realtime:ui.From')}</FormLabel>
              <Input
                type="date"
                value={dayjs(fromDate * 1e3).format('YYYY-MM-DD')}
                onChange={(e) => e.target.value && handleChangeFrom(e, dayjs(e.target.value))}
                {...inputStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel {...labelStyles}>{t('realtime:ui.To')}</FormLabel>
              <Input
                type="date"
                value={dayjs(toDate * 1e3).format('YYYY-MM-DD')}
                onChange={(e) => e.target.value && handleChangeTo(e, dayjs(e.target.value))}
                {...inputStyles}
              />
            </FormControl>
          </SimpleGrid>
        </Panel>
        {withLoader(
          () => (
            <Box marginTop="2rem">
              <Panel
                icon={<WiThermometer size={20} />}
                title={
                  <Flex alignItems="center" justifyContent="space-between" width="100%" wrap="wrap" gap={2}>
                    <span>{t('realtime:ui.Temperature')}</span>
                    {dateRangeLabel}
                  </Flex>
                }
                boxProps={{ marginBottom: 4 }}
              >
                <Statistics data={data} keyName="temperature" unit="°C" extremes={extremes} />
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
                icon={<WiBarometer size={20} />}
                title={
                  <Flex alignItems="center" justifyContent="space-between" width="100%" wrap="wrap" gap={2}>
                    <span>{t('realtime:ui.Pressure')}</span>
                    {dateRangeLabel}
                  </Flex>
                }
                boxProps={{ marginBottom: 4 }}
              >
                <Statistics data={data} keyName="pressure" unit="hPa" extremes={extremes} />
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
                icon={<WiHumidity size={20} />}
                title={
                  <Flex alignItems="center" justifyContent="space-between" width="100%" wrap="wrap" gap={2}>
                    <span>{t('realtime:ui.RelativeHumidity')}</span>
                    {dateRangeLabel}
                  </Flex>
                }
                boxProps={{ marginBottom: 4 }}
              >
                <Statistics data={data} keyName="relative_humidity" unit="%" extremes={extremes} />
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
                icon={<WiRain size={20} />}
                title={
                  <Flex alignItems="center" justifyContent="space-between" width="100%" wrap="wrap" gap={2}>
                    <span>{t('realtime:ui.Rain')}</span>
                    {dateRangeLabel}
                  </Flex>
                }
              >
                {<Statistics data={data} keyName="rain" unit="mm" useSameKey showTotal extremes={extremes} />}
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
                  showAccumulation
                  colorAccumulation={config.ui.chartColors[4]}
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
