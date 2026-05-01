import {
  Box,
  Button,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { IoGlobeOutline, IoLayersOutline } from 'react-icons/io5'

import Panel from '@Common/Components/Panel'
import ComponentsTheme from '@Theme/Components'

Cesium.Ion.defaultAccessToken = undefined

const DPC_WMS_URL = '/radar-dpc/service/wms'
const LEGACY_DPC_WMS_URL = 'https://radar-geowebcache.protezionecivile.it/service/wms'

const WEATHER_LAYERS = [
  {
    id: 'sri',
    label: 'Rain',
    layer: 'radar:sri',
    update: '5 min',
    color: '#06B6D4',
    description: 'Surface rainfall intensity',
    legend: 'Shows current rainfall intensity from radar estimates',
    style: {
      brightness: 1.45,
      contrast: 1.9,
      saturation: 1.7,
      gamma: 0.78,
      alphaBoost: 1.15,
    },
  },
  {
    id: 'radar',
    label: 'Radar',
    layer: 'radar:vmi',
    update: '5 min',
    color: '#10B981',
    description: 'Vertical maximum reflectivity',
    legend: 'Shows radar reflectivity, useful for locating precipitation cores',
    style: {
      brightness: 1.35,
      contrast: 1.8,
      saturation: 1.55,
      gamma: 0.78,
      alphaBoost: 1.1,
    },
  },
  {
    id: 'ir108',
    label: 'Clouds',
    layer: 'radar:ir108',
    update: '5 min',
    color: '#8B5CF6',
    description: 'MSG infrared cloud cover',
    legend: 'Shows infrared satellite cloud cover and colder cloud tops',
    style: {
      brightness: 1.25,
      contrast: 1.7,
      gamma: 0.7,
      alphaBoost: 1.2,
    },
  },
  {
    id: 'hrd',
    label: 'Heavy',
    layer: 'radar:hrd',
    update: '5 min',
    color: '#EF4444',
    description: 'Heavy rain detection',
    legend: 'Highlights cells detected as heavy or intense rainfall',
    style: {
      brightness: 1.35,
      contrast: 1.9,
      saturation: 1.7,
      gamma: 0.78,
      alphaBoost: 1.15,
    },
  },
  {
    id: 'srt1',
    label: '1h rain',
    layer: 'radar:srt1',
    update: '5 min',
    color: '#3B82F6',
    description: 'Rain accumulation in the last hour',
    legend: 'Shows estimated rain accumulation over the previous hour',
    style: {
      brightness: 1.35,
      contrast: 1.85,
      saturation: 1.65,
      gamma: 0.78,
      alphaBoost: 1.15,
    },
  },
  {
    id: 'temperature',
    label: 'Temp',
    layer: 'radar:temperature',
    update: '60 min',
    color: '#F59E0B',
    description: 'Interpolated ground temperature',
    legend: 'Shows the interpolated near-ground temperature field',
    style: {
      brightness: 1.1,
      contrast: 1.25,
      saturation: 1.15,
    },
  },
]

const applyWeatherLayerStyle = (layer, weatherLayer, opacity) => {
  const style = weatherLayer?.style || {}
  layer.alpha = Math.min(1, opacity * (style.alphaBoost || 1))
  layer.brightness = style.brightness || 1
  layer.contrast = style.contrast || 1
  layer.saturation = style.saturation || 1
  layer.gamma = style.gamma || 1
}

const isWeatherImageryLayer = (layer) => layer?.cumianaWeatherLayer
  || layer?.imageryProvider?.url === DPC_WMS_URL
  || layer?.imageryProvider?.url === LEGACY_DPC_WMS_URL

const removeWeatherImageryLayers = (viewer) => {
  const layers = viewer.imageryLayers
  for (let index = layers.length - 1; index >= 1; index -= 1) {
    const layer = layers.get(index)
    if (isWeatherImageryLayer(layer)) {
      layers.remove(layer, true)
    }
  }
}

const GpsMap = ({ lat, lng, alt }) => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const [activeLayerId, setActiveLayerId] = useState('sri')
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const wrapperRef = useRef()
  const cesiumContainerRef = useRef()
  const viewerRef = useRef(null)
  const weatherLayerRef = useRef(null)
  const overlayOpacityRef = useRef(overlayOpacity)
  const activeLayer = WEATHER_LAYERS.find(({ id }) => id === activeLayerId)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || viewerRef.current) return

    const cesiumDiv = document.createElement('div')
    cesiumDiv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;'
    wrapper.appendChild(cesiumDiv)
    cesiumContainerRef.current = cesiumDiv

    const viewer = new Cesium.Viewer(cesiumDiv, {
      baseLayer: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      infoBox: false,
      selectionIndicator: false,
      creditContainer: document.createElement('div'),
      skyBox: false,
      skyAtmosphere: new Cesium.SkyAtmosphere(),
    })

    viewer.scene.globe.enableLighting = false
    viewer.scene.fog.enabled = false

    const imagery = new Cesium.ImageryLayer(
      new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/',
      }),
    )
    viewer.imageryLayers.add(imagery)

    const stationPosition = Cesium.Cartesian3.fromDegrees(lng, lat, alt)

    viewer.entities.add({
      position: stationPosition,
      point: {
        pixelSize: 12,
        color: Cesium.Color.fromCssColorString('#F8FAFC'),
        outlineColor: Cesium.Color.fromCssColorString('#F59E0B'),
        outlineWidth: 3,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      ellipse: {
        semiMinorAxis: 720,
        semiMajorAxis: 720,
        material: Cesium.Color.fromCssColorString('#F59E0B').withAlpha(0.04),
        outline: true,
        outlineColor: Cesium.Color.fromCssColorString('#F59E0B').withAlpha(0.46),
        outlineWidth: 1,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    })

    const startPosition = Cesium.Cartesian3.fromDegrees(lng + 40, lat - 10, 20000000)
    viewer.camera.setView({ destination: startPosition })

    viewer.scene.screenSpaceCameraController.enableZoom = false
    viewer.scene.screenSpaceCameraController.enableRotate = false
    viewer.scene.screenSpaceCameraController.enableTilt = false

    viewer.resize()

    setTimeout(() => {
      viewer.resize()
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, 1450),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0,
        },
        duration: 16,
        complete: () => {
          viewer.scene.screenSpaceCameraController.enableZoom = true
          viewer.scene.screenSpaceCameraController.enableRotate = true
          viewer.scene.screenSpaceCameraController.enableTilt = true
        },
      })
    }, 1000)

    viewerRef.current = viewer

    const resizeObserver = new ResizeObserver(() => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.resize()
      }
    })
    resizeObserver.observe(wrapper)

    return () => {
      resizeObserver.disconnect()
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        removeWeatherImageryLayers(viewerRef.current)
        weatherLayerRef.current = null
        viewerRef.current.destroy()
        viewerRef.current = null
      }
      if (cesiumContainerRef.current && wrapper.contains(cesiumContainerRef.current)) {
        wrapper.removeChild(cesiumContainerRef.current)
      }
    }
  }, [lat, lng, alt])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    if (isDark) {
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#080c14')
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#080c14')
      viewer.imageryLayers.get(0).brightness = 0.72
      viewer.imageryLayers.get(0).contrast = 1.22
      viewer.imageryLayers.get(0).saturation = 0.68
      viewer.imageryLayers.get(0).gamma = 0.92
    } else {
      viewer.scene.globe.baseColor = Cesium.Color.WHITE
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#E2ECF1')
      viewer.imageryLayers.get(0).brightness = 1.0
      viewer.imageryLayers.get(0).contrast = 1.0
      viewer.imageryLayers.get(0).saturation = 1.0
      viewer.imageryLayers.get(0).gamma = 1.0
    }
  }, [isDark])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed()) return

    removeWeatherImageryLayers(viewer)
    weatherLayerRef.current = null

    const selectedLayer = WEATHER_LAYERS.find(({ id }) => id === activeLayerId)
    if (!selectedLayer) return

    const provider = new Cesium.WebMapServiceImageryProvider({
      url: DPC_WMS_URL,
      layers: selectedLayer.layer,
      rectangle: Cesium.Rectangle.fromDegrees(0, 0, 90, 90),
      parameters: {
        transparent: true,
        format: 'image/png',
        tiled: true,
        version: '1.1.1',
        styles: '',
      },
    })

    const layer = new Cesium.ImageryLayer(provider)
    applyWeatherLayerStyle(layer, selectedLayer, overlayOpacityRef.current)
    layer.cumianaWeatherLayer = true
    viewer.imageryLayers.add(layer)
    weatherLayerRef.current = layer
    viewer.scene.requestRender()

    return () => {
      if (
        viewerRef.current
        && !viewerRef.current.isDestroyed()
        && viewerRef.current.imageryLayers.contains(layer)
      ) {
        viewerRef.current.imageryLayers.remove(layer, true)
        viewerRef.current.scene.requestRender()
      }
      if (weatherLayerRef.current === layer) {
        weatherLayerRef.current = null
      }
    }
  }, [activeLayerId])

  useEffect(() => {
    overlayOpacityRef.current = overlayOpacity
    if (weatherLayerRef.current && activeLayer) {
      applyWeatherLayerStyle(weatherLayerRef.current, activeLayer, overlayOpacity)
      viewerRef.current?.scene.requestRender()
    }
  }, [activeLayer, overlayOpacity])

  return (
    <Panel
      boxProps={{ style: { width: '100%' } }}
      title={`${lat.toFixed(3)}N / ${lng.toFixed(3)}E — ${alt}m`}
      icon={<IoGlobeOutline />}
    >
      <Box
        ref={wrapperRef}
        w="100%"
        sx={{ aspectRatio: '16 / 10' }}
        position="relative"
        overflow="hidden"
        bg={isDark ? '#080c14' : '#E2ECF1'}
      >
        <Box
          position="absolute"
          top={3}
          left={3}
          right={3}
          zIndex={3}
          pointerEvents="none"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={3}
            flexWrap="wrap"
          >
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              flexWrap="wrap"
              pointerEvents="auto"
              bg={isDark ? 'rgba(8,12,20,0.78)' : 'rgba(248,251,252,0.82)'}
              border="1px solid"
              borderColor={isDark ? 'rgba(16,185,129,0.18)' : 'rgba(14,116,144,0.2)'}
              p={1}
            >
              <Box color={isDark ? '#10B981' : '#0E7490'} px={2} display="flex">
                <IoLayersOutline size={15} />
              </Box>
              <Button
                size="xs"
                variant="ghost"
                borderRadius="2px"
                h="24px"
                px={2}
                fontFamily="'Share Tech Mono', monospace"
                fontSize="10px"
                letterSpacing="wider"
                color={!activeLayerId ? isDark ? '#F59E0B' : '#D97706' : isDark ? 'gray.400' : '#526575'}
                bg={!activeLayerId ? isDark ? 'rgba(245,158,11,0.12)' : 'rgba(217,119,6,0.1)' : 'transparent'}
                _hover={{ bg: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(217,119,6,0.1)' }}
                onClick={() => setActiveLayerId(null)}
              >
                OFF
              </Button>
              {WEATHER_LAYERS.map(({ id, label, color }) => {
                const isActive = id === activeLayerId
                return (
                  <Button
                    key={id}
                    size="xs"
                    variant="ghost"
                    borderRadius="2px"
                    h="24px"
                    px={2}
                    fontFamily="'Share Tech Mono', monospace"
                    fontSize="10px"
                    letterSpacing="wider"
                    color={isActive ? color : isDark ? 'gray.400' : '#526575'}
                    bg={isActive ? `${color}22` : 'transparent'}
                    _hover={{ bg: `${color}18`, color }}
                    onClick={() => setActiveLayerId(id)}
                  >
                    {label.toUpperCase()}
                  </Button>
                )
              })}
            </Box>

            <Box
              display={{ base: 'none', md: 'flex' }}
              alignItems="center"
              gap={2}
              minW="190px"
              pointerEvents="auto"
              bg={isDark ? 'rgba(8,12,20,0.78)' : 'rgba(248,251,252,0.82)'}
              border="1px solid"
              borderColor={isDark ? 'rgba(16,185,129,0.18)' : 'rgba(14,116,144,0.2)'}
              px={3}
              py={1}
            >
              <Text
                fontFamily="'Share Tech Mono', monospace"
                fontSize="10px"
                color={isDark ? 'gray.400' : '#526575'}
                letterSpacing="wider"
                flexShrink={0}
              >
                OPACITY
              </Text>
              <Slider
                value={Math.round(overlayOpacity * 100)}
                min={45}
                max={100}
                onChange={(value) => setOverlayOpacity(value / 100)}
                isDisabled={!activeLayerId}
                sx={{
                  '& .chakra-slider__filled-track': { bg: activeLayer?.color || '#10B981' },
                  '& .chakra-slider__track': {
                    bg: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(14,116,144,0.14)',
                    h: '4px',
                    borderRadius: 0,
                  },
                  '& .chakra-slider__thumb': {
                    w: '12px',
                    h: '12px',
                    borderRadius: '2px',
                    bg: isDark ? '#0d1420' : ComponentsTheme.panel.bg.light,
                    borderColor: isDark ? 'rgba(16,185,129,0.45)' : 'rgba(14,116,144,0.42)',
                  },
                }}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </Box>
        </Box>

        {activeLayer && (
          <Box
            position="absolute"
            left={3}
            bottom={3}
            zIndex={3}
            maxW={{ base: 'calc(100% - 1.5rem)', md: '70%' }}
            bg={isDark ? 'rgba(8,12,20,0.78)' : 'rgba(248,251,252,0.84)'}
            border="1px solid"
            borderColor={isDark ? 'rgba(16,185,129,0.16)' : 'rgba(14,116,144,0.18)'}
            px={3}
            py={2}
            pointerEvents="none"
          >
            <Text
              fontFamily="'Share Tech Mono', monospace"
              fontSize="10px"
              letterSpacing="wider"
              color={isDark ? 'gray.400' : '#526575'}
              textTransform="uppercase"
            >
              {activeLayer.label} / {activeLayer.description} / UPDATE {activeLayer.update}
            </Text>
            <Text
              fontFamily="'Share Tech Mono', monospace"
              fontSize="9px"
              letterSpacing="wider"
              color={isDark ? 'gray.400' : '#647887'}
              mt={1}
              textTransform="uppercase"
            >
              {activeLayer.legend}
            </Text>
            <Text
              fontFamily="'Share Tech Mono', monospace"
              fontSize="9px"
              letterSpacing="wider"
              color={isDark ? 'gray.500' : '#647887'}
              mt={1}
            >
              SOURCE RADAR-DPC / CC-BY-SA
            </Text>
          </Box>
        )}

      </Box>
    </Panel>
  )
}

GpsMap.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  alt: PropTypes.number,
}

export default GpsMap
