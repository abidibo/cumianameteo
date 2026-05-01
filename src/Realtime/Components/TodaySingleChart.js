import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { defaultTo } from 'ramda'
import { useTranslation } from 'react-i18next'
import { useColorMode } from '@chakra-ui/react'

import { withLoader } from '@Common/Utils/HOF'
import { useTodayDataQuery } from '../Services/Api'
import { getChartTheme, mergeChartOptions } from '@Theme/HighchartsTheme'

window.moment = dayjs

const TodaySingleChart = ({ label, unit, keyName, color, type }) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { data } = useTodayDataQuery()
  const todayData = defaultTo([], data)
  const theme = getChartTheme(colorMode)

  let options = mergeChartOptions(theme, {
    chart: {
      ...theme.chart,
      zooming: { type: 'x' },
      type,
      height: '300px',
    },
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
    xAxis: {
      ...theme.xAxis,
      type: 'datetime',
      title: { text: t('realtime:ui.Datetime'), style: theme.xAxis.title.style },
    },
    yAxis: [
      mergeChartOptions(theme.yAxis, { title: { text: `${label} (${unit})` } }),
    ],
    series: [
      {
        name: label,
        data: todayData.map((d) => [dayjs(d.datetime).valueOf(), parseFloat(d[keyName])]),
        color,
        zIndex: 6,
        tooltip: { valueSuffix: unit },
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
