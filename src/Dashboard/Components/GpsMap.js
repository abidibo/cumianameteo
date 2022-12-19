import Panel from '@Common/Components/Panel'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { IoMapOutline } from 'react-icons/io5'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

const Map = ({ lat, lng }) => {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize(false)
    }, 200)
  }, [map])

  // attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  // attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  return (
    <>
        <Marker position={[lat, lng]} />
        <TileLayer
          attribution=''
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          attribution=''
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.png"
        />
    </>
  )
}

Map.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
}

const GpsMap = ({ lat, lng, alt }) => {
  return (
    <Panel boxProps={{style: { width: '100%', height: '100%', minHeight: '266px' }}} title={`(${lat}, ${lng}) - ${alt}m`} icon={<IoMapOutline />}>
      <MapContainer
        center={[lat, lng]}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: 'calc(100% - 40px)', width: '100%' }}
      >
        <Map lat={lat} lng={lng} />
      </MapContainer>
    </Panel>
  )
}

GpsMap.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  alt: PropTypes.number,
}

export default GpsMap
