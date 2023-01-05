import { useColorMode } from '@chakra-ui/react'
import dayjs from 'dayjs'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { withLoader } from '@Common/Utils/HOF'
import ComponentsTheme from '@Theme/Components'

window.moment = dayjs

const DataHistorySingleChart = ({
  label,
  labelMean,
  labelMin,
  labelMax,
  unit,
  colorMean,
  colorMin,
  colorMax,
  type,
  dataMean,
  dataMin,
  dataMax,
}) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()

  const series = []
  if (labelMean) {
    series.push({
      name: labelMean,
      data: dataMean,
      color: colorMean,
      zIndex: 6,
      tooltip: {
        valueSuffix: unit,
      },
    })
  }
  if (labelMin) {
    series.push({
      name: labelMin,
      data: dataMin,
      color: colorMin,
      zIndex: 6,
      tooltip: {
        valueSuffix: unit,
      },
    })
  }
  if (labelMax) {
    series.push({
      name: labelMax,
      data: dataMax,
      color: colorMax,
      zIndex: 6,
      tooltip: {
        valueSuffix: unit,
      },
    })
  }

  let options = {
    chart: {
      zoomType: 'x',
      type,
      height: '400px',
      backgroundColor: ComponentsTheme.chart.bg[colorMode],
      spacing: [40, 20, 20, 20],
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
    tooltip: {
      shared: true,
      crosshairs: true,
    },
    series,
  }

  return withLoader(
    () => (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    ),
    !dataMean?.length,
  )
}

DataHistorySingleChart.defaultProps = {
  type: 'spline',
}

DataHistorySingleChart.propTypes = {
  label: PropTypes.string,
  labelMean: PropTypes.string,
  labelMin: PropTypes.string,
  labelMax: PropTypes.string,
  unit: PropTypes.string,
  colorMean: PropTypes.string,
  colorMin: PropTypes.string,
  colorMax: PropTypes.string,
  type: PropTypes.string,
  dataMean: PropTypes.array,
  dataMin: PropTypes.array,
  dataMax: PropTypes.array,
}

export default DataHistorySingleChart
