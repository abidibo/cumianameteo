import dayjs from 'dayjs'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { defaultTo } from 'ramda'
import { useTranslation } from 'react-i18next'

import { withLoader } from '@Common/Utils/HOF'
import config from '@Config'

import { useTodayDataQuery } from './Services/Api'
import ComponentsTheme from '@Theme/Components'
import { useColorMode } from '@chakra-ui/react'

window.moment = dayjs

const TodayTemperatureChart = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { data } = useTodayDataQuery()
  const todayData = defaultTo([], data)

  let options = {
    chart: {
      zoomType: 'x',
      type: 'spline',
      height: '500px',
      backgroundColor: ComponentsTheme.chart.bg[colorMode],
      spacing: [40, 20, 20, 20],
    },
    colors: config.ui.chartColors,
    title: {
      style: {
        display: 'none',
      },
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: t('realtime:ui.Datetime'),
      },
      lineColor: '#000',
      labels: {
        style: {
          color: '#aaa',
        },
      },
    },
    yAxis: [
      {
        title: {
          text: `${t('realtime:ui.Temperature')} (°C)`,
        },
        gridLineColor: ComponentsTheme.chart.gridColor[colorMode],
        labels: {
          style: {
            color: '#aaa',
          },
        },
      },
      {
        title: {
          text: `${t('realtime:ui.Pressure')} (hPa)`,
        },
        opposite: false,
        gridLineColor: ComponentsTheme.chart.gridColor[colorMode],
        labels: {
          style: {
            color: '#aaa',
          },
        },
      },
      {
        title: {
          text: `${t('realtime:ui.Rain')} (mm)`,
        },
        min: 0,
        opposite: true,
        gridLineColor: ComponentsTheme.chart.gridColor[colorMode],
        labels: {
          style: {
            color: '#aaa',
          },
        },
      },
    ],
    tooltip: {
      shared: true,
      crosshairs: true,
    },
    plotOptions: {
      series: {
        cursor: 'pointer',
        marker: { lineWidth: 1, radius: 3 },
      },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
          color: '#aaa',
      },
    },
    series: [
      {
        name: t('realtime:ui.Temperature'),
        type: 'spline',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.temperature)]),
        zIndex: 6,
        tooltip: {
          valueSuffix: '°C',
        },
      },
      {
        name: t('realtime:ui.Pressure'),
        yAxis: 1,
        type: 'spline',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.pressure)]),
        dashStyle: 'Dash',
        zIndex: 3,
        tooltip: {
          valueSuffix: 'hPa',
        },
      },
      {
        name: t('realtime:ui.Rain'),
        yAxis: 2,
        type: 'column',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.rain_rate)]),
        zIndex: 1,
        tooltip: {
          valueSuffix: 'mm/h',
        },
      },
      {
        name: t('realtime:ui.Accumulation'),
        yAxis: 2,
        type: 'area',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.rain)]),
        zIndex: 2,
        opacity: 0.3,
        tooltip: {
          valueSuffix: 'mm',
        },
      },
    ],
  }

  return withLoader(
    () => (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    ),
    !todayData?.length,
  )
}

export default TodayTemperatureChart
