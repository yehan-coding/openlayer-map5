import './style.css'
import { useEffect, useState } from 'react'
import * as MapUtils from '../MapUtils'
import ControlPanel from './control'

const Map = () => {

  const [olMap, setOlMap] = useState(null)

  const init = () => {
    if (!olMap) {
      setOlMap(initMap())
    }
  }

  const initMap = () => {
    const baseLayers = MapUtils.loadTiandituLayers(MapUtils.TiandituType.VEC_4326, '20a7f8bb90799984c583494762102a35')
    return MapUtils.initMap({
      el: 'map',
      center: [116.397128, 39.946527],
      zoom: 11,
      layers: baseLayers,
      projection: 'EPSG:4326'
    })
  }

  useEffect(() => {
    console.log('map page useEffect')
    init()
  }, [])

  return <>
    <div className="map-page">
      <div id='map'></div>
      <ControlPanel map={ olMap } />
    </div>
  </>
}

export default Map
