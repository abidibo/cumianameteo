import { useColorMode } from '@chakra-ui/react'
import dayjs from 'dayjs'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import { forEachObjIndexed, isNil } from 'ramda'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { withLoader } from '@Common/Utils/HOF'
import { getChartTheme, mergeChartOptions } from '@Theme/HighchartsTheme'

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
  showAccumulation,
  colorAccumulation,
}) => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const theme = getChartTheme(colorMode)

  const updateAllOtherChartsExtremes = useCallback(({ min, max }) => {
    forEachObjIndexed((r) => {
      if (r?.chart !== keyName) {
        r?.chart.xAxis[0].setExtremes(min, max)
      }
    })(chartsRef.current)
  }, [keyName, chartsRef])

  const onZoomChange = useCallback(() => {
    if (!controllingChart) {
      setControllingChart(keyName)
    } else if (controllingChart !== keyName) {
      return false
    }
  }, [controllingChart, setControllingChart, keyName])

  const onAfterSetExtremes = useCallback((evt) => {
    if (controllingChart === keyName) {
      setExtremes([parseInt(evt.min / 1e3), parseInt(evt.max / 1e3)])
      updateAllOtherChartsExtremes(evt)
      if (isNil(evt.userMax)) {
        setControllingChart(null)
      }
    }
  }, [controllingChart, setControllingChart, keyName, updateAllOtherChartsExtremes, setExtremes])

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
      tooltip: { valueSuffix: unit },
    })
  }
  if (labelMin) {
    series.push({
      name: labelMin,
      data: dataMin,
      color: colorMin,
      zIndex: 6,
      tooltip: { valueSuffix: unit },
    })
  }
  if (labelMax) {
    series.push({
      name: labelMax,
      data: dataMax,
      color: colorMax,
      zIndex: 6,
      tooltip: { valueSuffix: unit },
    })
  }

  if (showAccumulation) {
    series.push({
      type: 'area',
      name: t('realtime:ui.Accumulation'),
      data: dataMean.reduce((acc, cur, idx) => [...acc, idx === 0 ? cur : [cur[0], acc[idx - 1][1] + cur[1]]], []),
      color: colorAccumulation,
      opacity: .5,
      zIndex: 5,
      tooltip: { valueSuffix: unit },
    })
  }

  let options = mergeChartOptions(theme, {
    chart: {
      ...theme.chart,
      zooming: { type: 'x' },
      type,
      height: '400px',
      events: { selection: onZoomChange },
    },
    xAxis: {
      ...theme.xAxis,
      type: 'datetime',
      title: { text: t('realtime:ui.Datetime'), style: theme.xAxis.title.style },
      events: { afterSetExtremes: onAfterSetExtremes },
    },
    yAxis: [
      mergeChartOptions(theme.yAxis, { title: { text: `${label} (${unit})` } }),
    ],
    series,
  })

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
  showAccumulation: PropTypes.bool,
  colorAccumulation: PropTypes.string,
}

export default DataHistorySingleChart
