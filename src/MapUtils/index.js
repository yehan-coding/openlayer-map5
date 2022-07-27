import 'ol/ol.css'
import { Map, View, Feature, Overlay } from 'ol'
import { Tile as TileLayer, Image as ImageLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ as XYZSource, ImageStatic, Vector as VectorSource } from 'ol/source'
import { Point, Circle, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon } from 'ol/geom'
import * as Style from 'ol/style'
import { transform } from 'ol/proj'
import { circular } from 'ol/geom/Polygon'
import { getDistance } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
import { boundingExtent, getCenter } from 'ol/extent'
import { easeOut } from 'ol/easing'
import { asArray } from 'ol/color'

/**
 * 天地图类型枚举
 */
export const TiandituType = {
  VEC_4326: ['vec_c', 'cva_c'],
  VEC_3857: ['vec_w', 'cva_w'],
  IMG_4326: ['img_c', 'cia_c'],
  IMG_3857: ['img_w', 'cia_w'],
  TER_4326: ['ter_c', 'cta_c'],
  TER_3857: ['ter_w', 'cta_w'],
}

/**
 * 矢量形状枚举
 */
export const VectorShape = {
  POINT: 'Point',
  POINTS: 'MultiPoint',
  LINE: 'LineString',
  LINES: 'MultiLineString',
  POLYGON: 'Polygon',
  POLYGONS: 'MultiPolygon',
  CIRCLE: 'Circle'
}

/**
 * 地图事件枚举
 */
export const MapEvent = {
  CLICK: 'click', // 点击事件
  SINGLE_CLICK: 'singleclick', // 单击事件
  DBL_CLICK: 'dblclick', // 双击事件
  CHANGE: 'change', // 改变事件
  MOVE_START: 'movestart', // 地图开始移动事件
  MOVE_END: 'moveend', // 地图移动后事件
  POINTER_DRAG: 'pointerdrag', // 鼠标拖动事件
  POINTER_MOVE: 'pointermove', // 鼠标移动事件
  POST_RENDER: 'postrender' // 地图渲染事件
}

/**
 * 初始化地图
 * @param {InitMap} options 配置项
 * @return 地图实例：map
 */
export function initMap(options) {
  const { el, center, zoom, layers, projection } = options
  const map = new Map({
    target: el,
    layers: layers,
    view: new View({
      projection: projection || 'EPSG:3857',
      center: transform([Number(center[0]), Number(center[1])], 'EPSG:4326', projection || 'EPSG:3857'),
      zoom: zoom
    }),
    controls: []
  })
  map.on('pointermove', (evt) => {
    map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : ''
  })
  return map
}

/**
 * 加载天地图
 * @param {TiandituType} types 天地图类型
 * @param {string} key 天地图密钥
 * @return 天地图图层数组：layers
 */
export function loadTiandituLayers(types, key) {
  return types.map(type => new TileLayer({
    title: type,
    source: new XYZSource({
      url: `http://t{0-7}.tianditu.com/DataServer?T=${type}&x={x}&y={y}&l={z}&tk=${key}`,
      projection: type.split('_')[1] === 'c' ? 'EPSG:4326' : 'EPSG:3857'
    })
  }))
}

/**
 * 添加矢量图层
 * @param {*} options 配置项
 * @return 矢量图层：layer
 */
export function addVectorLayer(map, options) {
  const { shape, data, layerName, zIndex, styleCallBack } = options
  const vectorLayer = new VectorLayer({
    title: layerName,
    layerName: layerName,
    shape: shape,
    source: new VectorSource({
      features: getFeaturesByShape(map, shape, data)
    }),
    zIndex: zIndex || 5,
    style:
      styleCallBack && !Array.isArray(styleCallBack)
        ? (feature, resolution) => styleCallBack({ feature, resolution, Style })
        : Array.isArray(styleCallBack)
            ? styleCallBack
            : undefined
  })
  map.addLayer(vectorLayer)
  return vectorLayer
}

/**
 * 根据shape生成features
 * @param {Object} map 地图实例
 * @param {VectorShape} shape 形状枚举
 * @param {Array} data 数据源
 * @return 要素数组：features
 */
export function getFeaturesByShape(map, shape, data) {
  const features = []
  switch (shape) {
    case VectorShape.POINT: // Point 处理
      features.push(...getPointFeatures(map, data))
      break
    case VectorShape.POINTS: // MultiPoint 处理
      features.push(...getPointsFeatures(map, data))
      break
    case VectorShape.LINE: // LineString 处理
      features.push(...getLineFeatures(map, data))
      break
    case VectorShape.LINES: // MultiLineString 处理
      features.push(...getLinesFeatures(map, data))
      break
    case VectorShape.POLYGON: // Polygon 处理
      features.push(...getPolygonFeatures(map, data))
      break
    case VectorShape.POLYGONS: // MultiPolygon 处理
      features.push(...getPolygonsFeatures(map, data))
      break
    case VectorShape.CIRCLE: // Circle 处理
      features.push(...getCircleFeatures(map, data))
      break
    default:
      console.log('oh no! 没有对应类型')
  }
  return features
}

/**
 * 生成Point类型的features
 * @param {Object} map 地图实例
 * @param {Array} data 数据源
 * @return Point数据要素数组：features
 */
export function getPointFeatures(map, data) {
  const destination = map.getView().getProjection().getCode()
  let features = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].lgtd && data[i].lttd) {
      features.push(new Feature({
        ...data[i],
        geometry: new Point([Number(data[i].lgtd), Number(data[i].lttd)]).transform('EPSG:4326', destination)
      }))
    } else {
      console.log('数据格式不正确')
    }
  }
  return features
}

/**
 * 生成MultiPoint类型的features
 * @param {Object} map 地图实例
 * @param {Array} data 数据源
 * @return MultiPoint数据要素数组：features
 */
export function getPointsFeatures(map, data) {
  const destination = map.getView().getProjection().getCode()
  let features = []
  for (let i = 0; i < data.length; i++) {
    const tmp = []
    if (data[i].latlngs && Array.isArray(data[i].latlngs)) {
      data[i].latlngs.forEach(([lgtd, lttd]) => {
        tmp.push([Number(lgtd), Number(lttd)])
      })
    } else {
      console.log('数据格式不正确')
    }
    delete data[i].latlngs
    features.push(new Feature({
      ...data[i],
      geometry: new MultiPoint(tmp).transform('EPSG:4326', destination)
    }))
  }
  return features
}

/**
 * 生成LineString类型的features
 * @param {Object} map 地图实例
 * @param {Array} data 数据源
 * @return LineString数据要素数组：features 
 */
export function getLineFeatures(map, data) {
  const destination = map.getView().getProjection().getCode()
  let features = []
  for (let i = 0; i < data.length; i++) {
    const tmp = []
    if (data[i].latlngs && Array.isArray(data[i].latlngs)) {
      data[i].latlngs.forEach(([lgtd, lttd]) => {
        tmp.push([Number(lgtd), Number(lttd)])
      })
    } else {
      console.log('数据格式不正确')
    }
    delete data[i].latlngs
    features.push(new Feature({
      ...data[i],
      geometry: new LineString(tmp).transform('EPSG:4326', destination)
    }))
  }
  return features
}

/**
 * 生成MultiLineString类型的features
 * @param {Object} map 地图实例
 * @param {Array} data 数据源
 * @returns MultiLineString数据要素数组：features
 */
export function getLinesFeatures(map, data) {
  const destination = map.getView().getProjection().getCode()
  let features = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].latlngs && Array.isArray(data[i].latlngs)) {
      const tmp = []
      for (let j = 0; j < data[i].latlngs.length; j++) {
        const subTmp = []
        data[i].latlngs[j].forEach(([lgtd, lttd]) => {
          subTmp.push([Number(lgtd), Number(lttd)])
        })
        tmp.push(subTmp)
      }
      delete data[i].latlngs
      features.push(new Feature({
        ...data[i],
        geometry: new MultiLineString(tmp).transform('EPSG:4326', destination)
      }))
    } else {
      console.log('数据格式不正确')
    }
  }
  return features
}

/**
 * 生成Polygon类型的features
 * @param {Object} map 地图实例
 * @param {Array} data 数据源
 * @return Polygon数据要素数组：features 
 */
export function getPolygonFeatures(map, data) {
  const destination = map.getView().getProjection().getCode()
  let features = []
  for (let i = 0; i < data.length; i++) {
    const tmp = []
    if (data[i].latlngs && Array.isArray(data[i].latlngs)) {
      if (data[i].latlngs.length !== 1 || data[i].latlngs[0].length < 3) {
        console.log('数据格式不正确')
        return
      }
      data[i].latlngs[0].forEach(([lgtd, lttd]) => {
        tmp.push([Number(lgtd), Number(lttd)])
      })
    } else {
      console.log('数据格式不正确')
    }
    delete data[i].latlngs
    features.push(new Feature({
      ...data[i],
      geometry: new Polygon([tmp]).transform('EPSG:4326', destination)
    }))
  }
  return features
}

/**
 * 生成MultiPolygon类型的features
 * @param {Object} map 地图实例
 * @param {Array} data 数据源
 * @returns MultiPolygon数据要素数组：features
 */
export function getPolygonsFeatures(map, data) {
  const destination = map.getView().getProjection().getCode()
  let features = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].latlngs && Array.isArray(data[i].latlngs)) {
      if (data[i].latlngs[0].length < 1) {
        console.log('数据格式不正确')
        return
      }
      const tmp = []
      for (let j = 0; j < data[i].latlngs.length; j++) {
        if (data[i].latlngs[j].length !== 1 || data[i].latlngs[j][0].length < 3) {
          console.log('数据格式不正确')
          return
        }
        const subTmp = []
        data[i].latlngs[j][0].forEach(([lgtd, lttd]) => {
          subTmp.push([Number(lgtd), Number(lttd)])
        })
        tmp.push([subTmp])
      }
      delete data[i].latlngs
      features.push(new Feature({
        ...data[i],
        geometry: new MultiPolygon(tmp).transform('EPSG:4326', destination)
      }))
    } else {
      console.log('数据格式不正确')
    }
  }
  return features
}

/**
 * 生成Circle类型的features
 * @param {Object} map 地图实例
 * @param {Array} data 数据源
 * @return Circle数据要素数组：features
 */
export function getCircleFeatures(map, data) {
  const destination = map.getView().getProjection().getCode()
  let features = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].lgtd && data[i].lttd) {
      if (destination === 'EPSG:4326') {
        features.push(new Feature({
          ...data[i],
          geometry: circular([Number(data[i].lgtd), Number(data[i].lttd)], data[i]['radius'], 64)
        }))
      } else {
        // 获取中心点
        const center = transform([Number(data[i].lgtd), Number(data[i].lttd)], 'EPSG:4326', 'EPSG:3857')
        // 获取边界点
        const edgePoint = [center[0] + data[i]['radius'], center[1]]
        // 获取两点之间的距离
        const distance = getDistance(transform(center, 'EPSG:3857', 'EPSG:4326'), transform(edgePoint,  'EPSG:3857', 'EPSG:4326'))
        // 获取真实半径的放大比例
        const zoomScale = data[i]['radius'] / distance
        features.push(new Feature({
          ...data[i],
          geometry: new Circle(center, data[i]['radius'] * zoomScale)
        }))
      }
    }
  }
  return features
}

/**
 * 添加地图事件监听
 * @param {Object} map 地图实例
 * @param {MapEvent} eventType 事件类型
 * @param {Function} fn 事件回调函数
 * @return 事件对象：eventKey
 */
export function addMapEventListener(map, eventType, fn) {
  return map.on(eventType, fn)
}

/**
 * 解除地图事件监听
 * @param {Object} eventKey 事件对象
 */
export function removeEventListener(eventKey) {
  unByKey(eventKey)
}

/**
 * 清除图层
 * @param {Object} map 地图实例
 * @param {Object} layer 需要清除的图层实例
 */
export function removeLayer(map, layer) {
  if (layer) {
    map.removeLayer(layer)
  } else {
    console.log('请传入对应图层')
  }
}

/**
 * 重置矢量图层的数据源
 * @param {Object} map 地图实例
 * @param {Object} layer 图层实例
 * @param {Array} data 数据源
 */
export function resetLayerSource(map, layer, data) {
  layer.setSource(new VectorLayer({
    features: getFeaturesByShape(map, layer.get('shape'), data)
  }))
}

/**
 * 添加图片图层
 * @param {ImageOptions} options 配置项
 * @return 图片图层：layer
 */
export function addImageLayer(map, options) {
  const { imageUrl, bounds, layerName, zIndex, opacity } = options
  const projection = map.getView().getProjection()
  const imageLayer = new ImageLayer({
    title: layerName,
    layerName: layerName,
    opacity: opacity || 1,
    source: new ImageStatic({
      url: imageUrl,
      imageExtent: boundingExtent([transform(bounds[0], 'EPSG:4326', projection || 'EPSG:3857'), transform(bounds[1], 'EPSG:4326', projection || 'EPSG:3857')])
    }),
    zIndex: zIndex || 5
  })
  map.addLayer(imageLayer)
  return imageLayer
}

/**
 * 更新图片图层
 * @param {Object} layer 图层实例
 * @param {string} imageUrl 图片url
 * @param {Array<Coordinate>} bounds 图片所在地图的边界
 */
export function updateImageLayer(layer, imageUrl, bounds) {
  layer.setSource(new ImageStatic({
    url: imageUrl,
    imageExtent: boundingExtent(bounds)
  }))
}

/**
 * 更新矢量图层样式
 * @param {Object} layer 图层实例
 * @param {Function} fn 样式回调函数
 */
export function updateVectorLayerStyle(layer, fn) {
  layer.setStyle((feature, resolution) => fn({ feature, resolution, Style }))
}

/**
 * 视图定位
 * @param {Object} map 地图实例
 * @param {ViewOptions} options 
 */
export function changeView(map, options) {
  const { center, zoom, extent, layer } = options
  const view = map.getView()
  const projection = view.getProjection()
  let vCenter
  let vZoom
  const vExtent = layer ? layer.getSource().getExtent() : extent
  if (vExtent) {
    const resolution = view.getResolutionForExtent(vExtent)
    vZoom = view.getZoomForResolution(resolution)
    vCenter = getCenter(vExtent)
  } else {
    vCenter = center ? transform(center, 'EPSG:4326', projection || 'EPSG:3857') : view.getCenter()
    vZoom = zoom || view.getZoom()
  }

  view.animate({ center: vCenter }, { zoom: vZoom })
}

export function addFlashToFeatures(map, options) {
  const { features, duration } = options
  let duration_ = duration || 2000
  let start = new Date().getTime() // 动画开始时间
  const listenKey = map.on('postcompose', e => { // 图层合成后事件监听
    const frameState = e.frameState // 事件帧状态
    const elapsed = frameState.time - start // 根据时间帧的当前时间减去动画开始的时间，计算出动画已经执行的时间
    if (elapsed >= duration_) { // 如果动画执行时间大于等于预设的动画执行时间
      start = new Date().getTime()
    }
    const vectorContext = e.vectorContext // 从事件中获取矢量容器
    const elapsedRatio = elapsed / duration_ // 通过动画已执行时间除以动画预设时间计算出动画执行的百分比(也叫动画执行进度)
    const radius = easeOut(elapsedRatio) * 10 + 5 // 通过动画函数(贝塞尔曲线)计算出当前圆环半径 easeOut：淡出，又快到慢，更多动画函数可以参考贝塞尔曲线
    const opacity = easeOut(1 - elapsedRatio)
    features.forEach(feature => {
      const color = feature.get('flashColor')
      const [r, g, b] = asArray(color)
      const style = new Style.Style({
        image: new Style.Circle({
          radius: radius,
          fill: new Style.Stroke({
            color: `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`,
            width: 0.25 + opacity
          }),
          stroke: new Style.Stroke({
            color: `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`,
            width: 1 + opacity
          })
        })
      })
      vectorContext.setStyle(style) // 给矢量容器设置样式
      vectorContext.drawGeometry(feature.getGeometry())
    })
    map.render() // 触发地图重新渲染
  })
  return listenKey
}

export function addOverLay(map, options) {
  const overlay = new Overlay({
    autoPan: true,
    stopEvent: true,
    ...options
  })
  map.addOverlay(overlay)
  return overlay
}
