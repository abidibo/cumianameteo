import { useColorMode } from '@chakra-ui/react'
import dayjs from 'dayjs'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import { forEachObjIndexed, isNil } from 'ramda'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { withLoader } from '@Common/Utils/HOF'
import ComponentsTheme from '@Theme/Components'

window.moment = dayjs

const DataHistorySingleChart = ({
  keyName,
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
  setExtremes,
  controllingChart,
  setControllingChart,
  innerRef,
  chartsRef,
}) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()

  const updateAllOtherChartsExtremes = ({ min, max }) => {
    // update all other charts extremes
    forEachObjIndexed((r) => {
      if (r?.chart !== keyName) {
        r?.chart.xAxis[0].setExtremes(min, max)
      }
    })(chartsRef.current)
  }

  const onZoomChange = () => {
    if (!controllingChart) {
      setControllingChart(keyName)
    } else if (controllingChart !== keyName) {
      return false
    }
  }

  const onAfterSetExtremes = (evt) => {
    if (controllingChart === keyName) {
      setExtremes([parseInt(evt.min / 1e3), parseInt(evt.max / 1e3)])
      updateAllOtherChartsExtremes(evt)
      if (isNil(evt.userMax)) { // reset zoom
        setControllingChart(null)
      }
    }
    // set extremes
  }

  useEffect(() => {
    if (controllingChart) {
      const min = chartsRef.current[controllingChart].chart.xAxis[0].min
      const max = chartsRef.current[controllingChart].chart.xAxis[0].max
      onAfterSetExtremes({ min, max, userMax: max })
    }
  }, [controllingChart, chartsRef])

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
      events: {
        selection: onZoomChange,
      },
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
      events: {
        afterSetExtremes: onAfterSetExtremes,
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
        <HighchartsReact highcharts={Highcharts} options={options} ref={(node) => innerRef(node)} />
      </div>
    ),
    !dataMean?.length,
  )
}

DataHistorySingleChart.defaultProps = {
  type: 'spline',
}

DataHistorySingleChart.propTypes = {
  keyName: PropTypes.string,
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
  extremes: PropTypes.array,
  setExtremes: PropTypes.func.isRequired,
  controllingChart: PropTypes.string,
  setControllingChart: PropTypes.func.isRequired,
  innerRef: PropTypes.any,
  chartsRef: PropTypes.object,
}

export default DataHistorySingleChart
