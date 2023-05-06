import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { defaultTo } from 'ramda'
import { useTranslation } from 'react-i18next'

import { withLoader } from '@Common/Utils/HOF'

import { useTodayDataQuery } from '../Services/Api'
import ComponentsTheme from '@Theme/Components'
import { useColorMode } from '@chakra-ui/react'

window.moment = dayjs

const TodaySingleChart = ({ label, unit, keyName, color, type }) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { data } = useTodayDataQuery()
  const todayData = defaultTo([], data)

  let options = {
    chart: {
      zoomType: 'x',
      type,
      height: '300px',
      backgroundColor: ComponentsTheme.chart.bg[colorMode],
      spacing: [40, 20, 20, 20],
    },
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
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
      lineColor: ComponentsTheme.chart.gridColor[colorMode],
      labels: {
        style: {
          color: '#aaa',
        },
      },
    },
    yAxis: [
      {
        title: {
          text: `${label} (${unit})`,
        },
        gridLineColor: ComponentsTheme.chart.gridColor[colorMode],
        labels: {
          style: {
            color: '#aaa',
          },
        },
      },
    ],
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
        name: label,
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d[keyName])]),
        color,
        zIndex: 6,
        tooltip: {
          valueSuffix: unit,
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

TodaySingleChart.defaultProps = {
  type: 'spline',
}

TodaySingleChart.propTypes = {
  label: PropTypes.string,
  unit: PropTypes.string,
  keyName: PropTypes.string,
  color: PropTypes.string,
  type: PropTypes.string,
}

export default TodaySingleChart
