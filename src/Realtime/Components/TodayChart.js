import dayjs from 'dayjs'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { defaultTo } from 'ramda'
import { useTranslation } from 'react-i18next'
import { useColorMode } from '@chakra-ui/react'

import { withLoader } from '@Common/Utils/HOF'
import config from '@Config'
import { useTodayDataQuery } from '../Services/Api'
import { getChartTheme, mergeChartOptions } from '@Theme/HighchartsTheme'

window.moment = dayjs

const TodayChart = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { data } = useTodayDataQuery()
  const todayData = defaultTo([], data)
  const theme = getChartTheme(colorMode)

  const makeYAxis = (titleText) =>
    mergeChartOptions(theme.yAxis, { title: { text: titleText } })

  let options = mergeChartOptions(theme, {
    chart: {
      ...theme.chart,
      zooming: { type: 'x' },
      type: 'spline',
      height: '500px',
    },
    colors: config.ui.chartColors,
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
    xAxis: {
      ...theme.xAxis,
      type: 'datetime',
      title: { text: t('realtime:ui.Datetime'), style: theme.xAxis.title.style },
    },
    yAxis: [
      makeYAxis(`${t('realtime:ui.Temperature')} (°C)`),
      { ...makeYAxis(`${t('realtime:ui.Pressure')} (hPa)`), opposite: false },
      { ...makeYAxis(`${t('realtime:ui.RelativeHumidity')} (%)`), min: 0, opposite: true },
      { ...makeYAxis(`${t('realtime:ui.Rain')} (mm)`), min: 0, opposite: true },
    ],
    series: [
      {
        name: t('realtime:ui.Temperature'),
        type: 'spline',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.temperature)]),
        zIndex: 6,
        tooltip: { valueSuffix: '°C' },
      },
      {
        name: t('realtime:ui.Pressure'),
        yAxis: 1,
        type: 'spline',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.pressure)]),
        dashStyle: 'Dash',
        zIndex: 3,
        tooltip: { valueSuffix: 'hPa' },
      },
      {
        name: t('realtime:ui.RelativeHumidity'),
        yAxis: 2,
        type: 'spline',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.relative_humidity)]),
        dashStyle: 'Dash',
        zIndex: 3,
        tooltip: { valueSuffix: '%' },
      },
      {
        name: t('realtime:ui.Rain'),
        yAxis: 3,
        type: 'column',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.rain_rate)]),
        zIndex: 1,
        tooltip: { valueSuffix: 'mm/h' },
      },
      {
        name: t('realtime:ui.Accumulation'),
        yAxis: 3,
        type: 'area',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.rain)]),
        zIndex: 2,
        opacity: 0.3,
        tooltip: { valueSuffix: 'mm' },
      },
    ],
  })

  return withLoader(
    () => (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    ),
    !todayData?.length,
  )
}

export default TodayChart
