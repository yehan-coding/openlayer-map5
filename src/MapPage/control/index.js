import './style.css'
import React from 'react'
import * as MapUtils from '../../MapUtils'
import { useEffect, useRef } from 'react'
import OverlayBox from './OverlayBox'

const ControlPanel = ({ map }) => {

  const overlayDiv = useRef()

  let clickKey = null
  const layers = {}
  const overlays = {}
  let flashKey = null

  const addMapClickListener = () => {
    clickKey = MapUtils.addMapEventListener(map, MapUtils.MapEvent.SINGLE_CLICK, e => {
      console.log(e)
    })
  }

  const removeMapClickListener = () => {
    MapUtils.removeEventListener(clickKey)
  }

  const addPoint = () => {
    if (!layers.pointLayer) {
      layers.pointLayer = MapUtils.addVectorLayer(map, {
        shape: MapUtils.VectorShape.POINT,
        data: [
          { name: 'point1', lgtd: 115.98369598388672, lttd: 40.20515441894531 },
          { name: 'point2', lgtd: 115.89237213134766, lttd: 40.22918701171875 }
        ],
        layerName: 'point'
      })
    }
  }

  // const addPoints = () => {
  //   pointLayer = MapUtils.addVectorLayer({
  //     map: map,
  //     shape: MapUtils.VectorShape.POINTS,
  //     data: [
  //       {
  //         name: 'points1',
  //         latlngs: [
  //           [116.04583740234375, 39.84466552734375],
  //           [116.09630584716797, 39.84260559082031],
  //           [116.11038208007812, 39.80175018310547],
  //           [116.08222961425781, 39.781494140625]
  //         ]
  //       }
  //     ],
  //     layerName: 'point'
  //   })
  // }

  const addLine = () => {
    if (!layers.lineLayer) {
      layers.lineLayer = MapUtils.addVectorLayer(map, {
        shape: MapUtils.VectorShape.LINE,
        data: [
          {
            name: 'line1',
            latlngs: [
              [115.87692260742188, 40.05821228027344],
              [115.95176696777344, 40.03074645996094],
              [115.92018127441406, 39.95384216308594],
              [115.95932006835938, 39.87213134765625],
              [115.91056823730469, 39.818572998046875]
            ]
          }
        ],
        layerName: 'line'
      })
    }
  }

  // const addLines = () => {
  //   lineLayer = MapUtils.addVectorLayer({
  //     map: map,
  //     shape: MapUtils.VectorShape.LINES,
  //     data: [
  //       {
  //         name: 'line1',
  //         latlngs: [
  //           [
  //             [115.7794189453125, 39.92706298828125],
  //             [115.82611083984375, 39.91950988769531],
  //             [115.88653564453125, 39.925689697265625]
  //           ],
  //           [
  //             [115.84259033203125, 39.873504638671875],
  //             [115.85426330566406, 39.8309326171875],
  //             [115.8563232421875, 39.76432800292969]
  //           ]
  //         ]
  //       }
  //     ],
  //     layerName: 'line'
  //   })
  // }

  const addPolygon = () => {
    if (!layers.polygonLayer) {
      layers.polygonLayer = MapUtils.addVectorLayer(map, {
        shape: MapUtils.VectorShape.POLYGON,
        data: [
          {
            name: 'polygon1',
            latlngs: [
              [
                [116.17355346679688, 40.06095886230469],
                [116.38229370117188, 40.03211975097656],
                [116.37954711914062, 39.83024597167969],
                [116.15776062011719, 39.78973388671875],
                [116.08566284179688, 39.91607666015625]
              ]
            ]
          }
        ],
        layerName: 'polygon'
      })
    }
  }

  // const addPolygons = () => {
  //   polygonLayer = MapUtils.addVectorLayer({
  //     map: map,
  //     shape: MapUtils.VectorShape.POLYGONS,
  //     data: [
  //       {
  //         name: 'polygons1',
  //         latlngs: [
  //           [
  //             [
  //               [116.048583984375, 40.117950439453125],
  //               [116.18728637695312, 40.10902404785156],
  //               [116.21131896972656, 39.96208190917969],
  //               [116.0760498046875, 39.914703369140625],
  //               [115.97923278808594, 40.001220703125]
  //             ]
  //           ],
  //           [
  //             [
  //               [115.98609924316406, 39.75059509277344],
  //               [116.07261657714844, 39.84123229980469],
  //               [116.1419677734375, 39.68536376953125]
  //             ]
  //           ]
  //         ]
  //       }
  //     ],
  //     layerName: 'polygons'
  //   })
  // }

  const addCircle = () => {
    if (!layers.circleLayer) {
      layers.circleLayer = MapUtils.addVectorLayer(map, {
        shape: MapUtils.VectorShape.CIRCLE,
        data: [
          { lgtd: 116.397128, lttd: 39.946527, radius: 6000 }
        ]
      })
    }
  }

  const removeLayer = (layerName) => {
    MapUtils.removeLayer(map, layers[layerName])
    delete layers[layerName]
  }

  const viewTo = () => {
    MapUtils.changeView(map, { center: [116.397128, 39.946527], zoom: 9 })
  }

  const addImage = () => {
    if (!layers.imageLayer) {
      layers.imageLayer = MapUtils.addImageLayer(map, {
        imageUrl: '/image-layer.png',
        bounds: [[111.85, 36.05], [121.09, 43.554]],
        layerName: 'imageLayer'
      })
    }
  }

  const addFlashPoint = () => {
    if (!layers.flashLayer) {
      layers.flashLayer = MapUtils.addVectorLayer(map, {
        shape: MapUtils.VectorShape.POINT,
        data: [
          { name: 'flashPoint1', lgtd: 115.90301513671875, lttd: 40.11383056640625, flashColor: '#ff0000' },
          { name: 'flashPoint2', lgtd: 116.8890380859375, lttd: 39.9078369140625, flashColor: '#00ff00' },
          { name: 'flashPoint2', lgtd: 116.1199951171875, lttd: 39.3145751953125, flashColor: '#0000ff' },
        ],
        layerName: 'flashPoint'
      })
      flashKey = MapUtils.addFlashToFeatures(map, {
        features: layers.flashLayer.getSource().getFeatures()
      })
    }
  }

  const removeFlash = () => {
    MapUtils.removeEventListener(flashKey)
    removeLayer('flashLayer')
  }

  // const appendDomNode = () => {
  //   const dom = <div>ddd</div>
  //   console.log(dom)
  //   console.log(OverlayBox)
  // }

  // const addOverlay = () => {
  //   if (!overlays.infoBox) {
  //     appendDomNode()
  //     console.log(overlayDiv)
  //     // layers.infoBox = MapUtils.addOverLay(map, {
  //     //   element: ,
  //     //   position: [116.397128, 39.946527]
  //     // })
  //   }
  // }

  // const removeOverlay = () => {
  //   if (!layers.flashLayer) {
  //     layers.flashLayer = MapUtils.addVectorLayer(map, {
  //       shape: MapUtils.VectorShape.POINT,
  //       data: [
  //         { name: 'flashPoint1', lgtd: 115.90301513671875, lttd: 40.11383056640625, flashColor: '#ff0000' },
  //         { name: 'flashPoint2', lgtd: 116.8890380859375, lttd: 39.9078369140625, flashColor: '#00ff00' },
  //         { name: 'flashPoint2', lgtd: 116.1199951171875, lttd: 39.3145751953125, flashColor: '#0000ff' },
  //       ],
  //       layerName: 'flashPoint'
  //     })
  //     flashKey = MapUtils.addFlashToFeatures(map, {
  //       features: layers.flashLayer.getSource().getFeatures()
  //     })
  //   }
  // }

  useEffect(() => {
    console.log('control-panel useEffect')
  }, [])

  return <>
    <div className="control-panel">
      <button onClick={ () => addMapClickListener() }>添加地图点击事件</button>
      <button onClick={ () => removeMapClickListener() }>取消地图点击事件</button>
      <button onClick={ () => addPoint() }>添加点</button>
      <button onClick={ () => removeLayer('pointLayer') }>取消点</button>
      <button onClick={ () => addLine() }>添加线</button>
      <button onClick={ () => removeLayer('lineLayer') }>取消线</button>
      <button onClick={ () => addPolygon() }>添加面</button>
      <button onClick={ () => removeLayer('polygonLayer') }>取消面</button>
      <button onClick={ () => addCircle() }>添加圆</button>
      <button onClick={ () => removeLayer('circleLayer') }>取消圆</button>
      <button onClick={ () => viewTo() }>定位</button>
      <button onClick={ () => addImage() }>添加图片</button>
      <button onClick={ () => removeLayer('imageLayer') }>取消图片</button>
      <button onClick={ () => addFlashPoint() }>添加闪烁点</button>
      <button onClick={ () => removeFlash() }>取消闪烁点</button>
      {/* <button onClick={ () => addOverlay() }>添加overlay</button>
      <button onClick={ () => removeOverlay() }>取消overlay</button> */}
    </div>
  </>
}

export default ControlPanel
