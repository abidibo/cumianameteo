import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

const Map = ({ lat, lng }) => {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize(false)
    }, 100)
  }, [map])

  return (
    <>
        <Marker position={[lat, lng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
    </>
  )
}

Map.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
}

const GpsMap = ({ lat, lng }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '266px' }}>
      <MapContainer
        center={[lat, lng]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <Map lat={lat} lng={lng} />
      </MapContainer>
    </div>
  )
}

GpsMap.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  alt: PropTypes.number,
}

export default GpsMap
