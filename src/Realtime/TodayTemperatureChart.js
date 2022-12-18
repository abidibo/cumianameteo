import dayjs from 'dayjs'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { defaultTo } from 'ramda'
import { useTranslation } from 'react-i18next'

import { withLoader } from '@Common/Utils/HOF'

import { useTodayDataQuery } from './Services/Api'
import config from '@Config'

window.moment = dayjs

const TodayTemperatureChart = () => {
  const { t } = useTranslation()
  const { data } = useTodayDataQuery()
  const todayData = defaultTo([], data)

  let options = {
    chart: {
      zoomType: 'x',
      type: 'spline',
      height: '500px',
      backgroundColor: '#121212',
    },
    colors: config.ui.chartColors,
    title: {
      text: t('realtime:ui.TodayMeasures'),
      style: {
        color: '#fff',
      }
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: t('realtime:ui.Datetime'),
      },
      lineColor: '#000',
    },
    yAxis: [
      {
        title: {
          text: `${t('realtime:ui.Temperature')} (°C)`,
        },
        gridLineColor: '#000',
      },
      {
        title: {
          text: `${t('realtime:ui.Pressure')} (hPa)`,
        },
        opposite: false,
        gridLineColor: '#000',
      },
      {
        title: {
          text: `${t('realtime:ui.Rain')} (mm)`,
        },
        min: 0,
        opposite: true,
        gridLineColor: '#000',
      },
      {
        title: {
          text: `${t('realtime:ui.Accumulation')} (mm)`,
        },
        min: 0,
        opposite: true,
        gridLineColor: '#000',
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
          valueSuffix: 'mm',
        },
      },
      {
        name: t('realtime:ui.Accumulation'),
        yAxis: 3,
        type: 'area',
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d.rain)]),
        zIndex: 2,
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
