import ComponentsTheme from './Components'

export const getChartTheme = (colorMode) => {
  const isDark = colorMode === 'dark'

  return {
    chart: {
      backgroundColor: ComponentsTheme.chart.bg[colorMode],
      style: { fontFamily: "'Share Tech Mono', 'SF Mono', Consolas, monospace" },
      spacing: [30, 16, 16, 16],
    },
    title: {
      style: { display: 'none' },
    },
    xAxis: {
      gridLineColor: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(0,0,0,0.06)',
      lineColor: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.1)',
      tickColor: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.1)',
      labels: {
        style: {
          color: isDark ? '#4a8a7a' : '#8a9aa4',
          fontSize: '10px',
        },
      },
      title: {
        style: {
          color: isDark ? '#4a8a7a' : '#8a9aa4',
          fontSize: '11px',
        },
      },
    },
    yAxis: {
      gridLineColor: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(0,0,0,0.06)',
      lineColor: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.06)',
      labels: {
        style: {
          color: isDark ? '#4a8a7a' : '#8a9aa4',
          fontSize: '10px',
        },
      },
      title: {
        style: {
          color: isDark ? '#4a8a7a' : '#8a9aa4',
          fontSize: '11px',
        },
      },
    },
    tooltip: {
      backgroundColor: isDark ? 'rgba(13,20,32,0.95)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.1)',
      borderRadius: 2,
      borderWidth: 1,
      style: {
        color: isDark ? '#c0e0d0' : '#333',
        fontFamily: "'Share Tech Mono', 'SF Mono', Consolas, monospace",
        fontSize: '11px',
      },
      shared: true,
      crosshairs: {
        color: isDark ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.15)',
        dashStyle: 'Dash',
        width: 1,
      },
    },
    legend: {
      itemStyle: {
        color: isDark ? '#6a9a8a' : '#666',
        fontFamily: "'Share Tech Mono', 'SF Mono', Consolas, monospace",
        fontSize: '10px',
        fontWeight: 'normal',
        textTransform: 'uppercase',
      },
      itemHoverStyle: {
        color: isDark ? '#10B981' : '#059669',
      },
    },
    plotOptions: {
      series: {
        cursor: 'pointer',
        marker: { radius: 2, lineWidth: 0 },
        states: { hover: { lineWidthPlus: 1 } },
      },
    },
  }
}

export const mergeChartOptions = (base, overrides) => {
  const result = { ...base }
  for (const key of Object.keys(overrides)) {
    if (
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key]) &&
      typeof overrides[key] === 'object' &&
      !Array.isArray(overrides[key])
    ) {
      result[key] = mergeChartOptions(result[key], overrides[key])
    } else {
      result[key] = overrides[key]
    }
  }
  return result
}
