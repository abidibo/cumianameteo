import { Box, useColorMode } from '@chakra-ui/react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import { IoGlobeOutline } from 'react-icons/io5'

import Panel from '@Common/Components/Panel'

Cesium.Ion.defaultAccessToken = undefined

const GpsMap = ({ lat, lng, alt }) => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const wrapperRef = useRef()
  const cesiumContainerRef = useRef()
  const viewerRef = useRef(null)

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
        pixelSize: 10,
        color: Cesium.Color.fromCssColorString('#10B981'),
        outlineColor: Cesium.Color.fromCssColorString('#10B981').withAlpha(0.4),
        outlineWidth: 4,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
      ellipse: {
        semiMinorAxis: 800,
        semiMajorAxis: 800,
        material: Cesium.Color.fromCssColorString('#10B981').withAlpha(0.08),
        outline: true,
        outlineColor: Cesium.Color.fromCssColorString('#10B981').withAlpha(0.3),
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
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, 800),
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
        {isDark && (
          <Box
            position="absolute"
            inset={0}
            zIndex={1}
            pointerEvents="none"
            bg="linear-gradient(180deg, rgba(8,12,20,0.08), rgba(8,12,20,0.2)), linear-gradient(90deg, rgba(16,185,129,0.08), transparent 45%, rgba(6,182,212,0.06))"
            boxShadow="inset 0 0 80px rgba(8,12,20,0.28)"
          />
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
