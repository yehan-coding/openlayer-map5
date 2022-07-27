declare module 'ol'
declare enum TiandituType {
  VEC_4326 = ['vec_c', 'cva_c'],
  VEC_3857 = ['vec_w', 'cva_w'],
  IMG_4326 = ['img_c', 'cia_c'],
  IMG_4326 = ['img_w', 'cia_w'],
  TER_4326 = ['ter_c', 'cta_c'],
  TER_3857 = ['ter_w', 'cta_w']
}

declare enum VectorShape {
  POINT = 'Point',
  POINTS = 'MultiPoint',
  LINE = 'LineString',
  LINES = 'MultiLineString',
  POLYGON = 'Polygon',
  POLYGONS = 'MultiPolygon',
  CIRCLE = 'Circle'
}

declare enum MapEvent {
  CLICK = 'click', // 点击事件
  SINGLE_CLICK = 'singleclick', // 单击事件
  DBL_CLICK = 'dblclick', // 双击事件
  CHANGE = 'change', // 改变事件
  MOVE_START = 'movestart', // 地图开始移动事件
  MOVE_END = 'moveend', // 地图移动后事件
  POINTER_DRAG = 'pointerdrag', // 鼠标拖动事件
  POINTER_MOVE = 'pointermove', // 鼠标移动事件
  POST_RENDER = 'postrender' // 地图渲染事件
}

declare interface InitMap {
  el: string | HTMLDivElement;
  center: Array<number>;
  zoom: number;
  layers: Array<Object>;
  projection?: string;
  minZoom?: number;
  maxZoom?: number;
}

declare interface VectorOptions {
  shape: VectorShape;
  data: Array<Object>;
  layerName: string;
  zIndex?: number;
  styleCallBack?: Function | Array;
}

declare interface Coordinate {
  [index: number]: [number];
}

declare interface VectorPointData {
  lgtd: number;
  lttd: number;
  [propName: string]: any;
}

declare interface VectorPointsData {
  latlngs: Array<Coordinate>;
  [propName: string]: any;
}

declare interface VectorLineData {
  latlngs: Array<Coordinate>;
  [propName: string]: any;
}

declare interface VectorLinesData {
  latlngs: Array<Array<Coordinate>>;
  [propName: string]: any;
}

declare interface VectorPolygonData {
  latlngs: Array<Array<Coordinate>>;
  [propName: string]: any;
}

declare interface VectorPolygonsData {
  latlngs: Array<Array<Array<Coordinate>>>;
  [propName: string]: any;
}

declare interface VectorCircleData {
  lgtd: number;
  lttd: number;
  radius: number;
  [propName: string]: any;
}

declare interface ImageOptions {
  imageUrl: string;
  bounds: Array<Coordinate>;
  layerName: string;
  zIndex?: number;
  opacity?: number;
}

declare interface ViewOptions {
  center?: Coordinate;
  zoom?: number;
  extent?: Array;
  layer?: Object;
}

declare interface FlashOptions {
  features: Array<Object>;
  duration?: Array;
}

declare interface OverlayOptions {
  element: HTMLElement;
  position: Coordinate;
  id?: number | string;
  offset?: Array<number>;
  positioning?: string;
  stopEvent?: boolean;
  insertFirst?: boolean;
  autoPan?: boolean;
  autoPanAnimation?: Object;
  autoPanMargin?: number;
  className?: string
}

declare function initMap(options: InitMap): Object
declare function loadTiandituLayers(types: TiandituType, key: string): Array<Object>
declare function addVectorLayer(options: VectorOptions): Object
declare function getFeaturesByShape(map: Object, shape: VectorShape, data: Array<Object>): Array<Object>
declare function getPointFeatures(map: Object, data: Array<VectorPointData>): Array<Object>
declare function getPointsFeatures(map: Object, data: Array<Array<VectorPointsData>>): Array<Object>
declare function getLineFeatures(map: Object, data: Array<VectorLineData>): Array<Object>
declare function getLinesFeatures(map: Object, data: Array<VectorLinesData>): Array<Object>
declare function getPolygonFeatures(map: Object, data: Array<VectorPolygonData>): Array<Object>
declare function getPolygonsFeatures(map: Object, data: Array<VectorPolygonsData>): Array<Object>
declare function getCircleFeatures(map: Object, data: Array<VectorCircleData>): Array<Object>
declare function addMapEventListener(map: Object, eventType: MapEvent, fn: Function): Object
declare function removeEventListener(eventKey: Object): void
declare function removeLayer(map: Object, layer: Object): void
declare function resetLayerSource(map: Object, layer: Object, data: Array): void
declare function addImageLayer(options: ImageOptions): Object
declare function updateImageLayer(layer: Object, imageUrl: string, bounds: Array<Coordinate>): void
declare function updateVectorLayerStyle(layer: Object, fn: Function): void
declare function changeView(map: Object, options: ViewOptions): void
declare function addFlashToFeatures(map: Object, options: FlashOptions): void
declare function addOverLay(map: Object, options: OverlayOptions): Object

export {
  TiandituType,
  VectorShape,
  MapEvent,
  initMap,
  loadTiandituLayers,
  addVectorLayer,
  getFeaturesByShape,
  getPointFeatures,
  getPointsFeatures,
  getLineFeatures,
  getLinesFeatures,
  getPolygonFeatures,
  getPolygonsFeatures,
  getCircleFeatures,
  addMapEventListener,
  removeEventListener,
  removeLayer,
  resetLayerSource,
  addImageLayer,
  updateImageLayer,
  updateVectorLayerStyle,
  changeView,
  addFlashToFeatures,
  addOverLay
}
