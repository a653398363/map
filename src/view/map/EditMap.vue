<template>
  <div class="index">
    <div id="map" class="map"></div>
    <div id="popup" class="ol-popup" v-show="popupVisble">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content">
          <router-view ref="saveTab" :coorObj="coorObj"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay.js";
import { defaults as defaultControls } from "ol/control.js";
import { Tile as TileLayer } from "ol/layer.js";
import { Draw, Modify, Snap, Select } from "ol/interaction.js";
import OSM, { ATTRIBUTION } from "ol/source/OSM.js";
import XYZ from "ol/source/XYZ.js";

import TileJSON from "ol/source/TileJSON.js";
import { toStringHDMS } from "ol/coordinate.js";
import { toStringXY } from "ol/coordinate";
import {
  fromLonLat,
  addProjection,
  addCoordinateTransforms,
  transform,
  toLonLat
} from "ol/proj";
import EsriJSON from "ol/format/EsriJSON";
import GeoJSON from "ol/format/GeoJSON";
//import { Vector as VectorSource } from "ol/source.js";
import { Circle as CircleStyle, Fill, Stroke, Style ,Icon} from "ol/style.js";
import { control } from "ol/control.js";

import {defaults as defaultInteractions} from 'ol/interaction.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';


export default {
  data() {
    return {
      map: "",
      draw: "",
      pielayer: "",
      Isupdate:'',
      popupVisble: false,
      coorObj:{},   //需要保存的坐标数据对象
      modify: "",
      overlay: "", //弹出框
      snap: "",
      source: "",
      Ismodify: false,
      overlay: "",
      
    };
  },
  created() {
    //请求数据
    // this.getData();
  },
  mounted() {
    this.getData();
    // this.initMap();
  },
  watch: {
    // "Ismodify"(Ismodify){
    //   console.log("Ismodify",Ismodify)
    // }
  },
  methods: {
    creadlay() {
      
    },
    initMap1() {
      var styleFunction = (function() {
        var styles = {};
        var image = new CircleStyle({
          radius: 5,
          fill: null,
          stroke: new Stroke({color: 'orange', width: 2})
        });
        styles['Point'] = new Style({image: image});
        styles['Polygon'] = new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 3
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
        });
        styles['MultiLineString'] = new Style({
          stroke: new Stroke({
            color: 'green',
            width: 3
          })
        });
        styles['MultiPolygon'] = new Style({
          stroke: new Stroke({
            color: 'yellow',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 0, 0.1)'
          })
        });
        styles['default'] = new Style({
          stroke: new Stroke({
            color: 'red',
            width: 3
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.1)'
          }),
          image: image
        });
        return function(feature) {
          return styles[feature.getGeometry().getType()] || styles['default'];
        };
      })();

      var geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857'
          }
        },
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [0, 0]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiPoint',
            'coordinates': [[-2e6, 0], [0, -2e6]]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[4e6, -2e6], [8e6, 2e6], [9e6, 2e6]]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[4e6, -2e6], [8e6, 2e6], [8e6, 3e6]]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [[[-5e6, -1e6], [-4e6, 1e6],
              [-3e6, -1e6], [-5e6, -1e6]], [[-4.5e6, -0.5e6],
              [-3.5e6, -0.5e6], [-4e6, 0.5e6], [-4.5e6, -0.5e6]]]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiLineString',
            'coordinates': [
              [[-1e6, -7.5e5], [-1e6, 7.5e5]],
              [[-1e6, -7.5e5], [-1e6, 7.5e5], [-5e5, 0], [-1e6, -7.5e5]],
              [[1e6, -7.5e5], [15e5, 0], [15e5, 0], [1e6, 7.5e5]],
              [[-7.5e5, -1e6], [7.5e5, -1e6]],
              [[-7.5e5, 1e6], [7.5e5, 1e6]]
            ]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiPolygon',
            'coordinates': [
              [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6],
                [-3e6, 6e6], [-5e6, 6e6]]],
              [[[-3e6, 6e6], [-2e6, 8e6], [0, 8e6],
                [0, 6e6], [-3e6, 6e6]]],
              [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6],
                [3e6, 6e6], [1e6, 6e6]]]
            ]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'GeometryCollection',
            'geometries': [{
              'type': 'LineString',
              'coordinates': [[-5e6, -5e6], [0, -5e6]]
            }, {
              'type': 'Point',
              'coordinates': [4e6, -5e6]
            }, {
              'type': 'Polygon',
              'coordinates': [
                [[1e6, -6e6], [2e6, -4e6], [3e6, -6e6], [1e6, -6e6]]
              ]
            }]
          }
        }]
      };

      var source = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojsonObject)
      });

      var layer = new VectorLayer({
        source: source,
        style: styleFunction
      });

      var overlayStyle = (function() {
        var styles = {};
        styles['Polygon'] = [
          new Style({
            fill: new Fill({
              color: [255, 255, 255, 0.5]
            })
          }),
          new Style({
            stroke: new Stroke({
              color: [255, 255, 255, 1],
              width: 5
            })
          }),
          new Style({
            stroke: new Stroke({
              color: [0, 153, 255, 1],
              width: 3
            })
          })
        ];
        styles['MultiPolygon'] = styles['Polygon'];

        styles['LineString'] = [
          new Style({
            stroke: new Stroke({
              color: [255, 255, 255, 1],
              width: 5
            })
          }),
          new Style({
            stroke: new Stroke({
              color: [0, 153, 255, 1],
              width: 3
            })
          })
        ];
        styles['MultiLineString'] = styles['LineString'];

        styles['Point'] = [
          new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: [0, 153, 255, 1]
              }),
              stroke: new Stroke({
                color: [255, 255, 255, 0.75],
                width: 1.5
              })
            }),
            zIndex: 100000
          })
        ];
        styles['MultiPoint'] = styles['Point'];

        styles['GeometryCollection'] = styles['Polygon'].concat(styles['Point']);

        return function(feature) {
          return styles[feature.getGeometry().getType()];
        };
      })();

      var select = new Select({
        style: overlayStyle
      });

      var modify = new Modify({
        features: select.getFeatures(),
        style: overlayStyle,
        insertVertexCondition: function() {
          // prevent new vertices to be added to the polygons
          return !select.getFeatures().getArray().every(function(feature) {
            return feature.getGeometry().getType().match(/Polygon/);
          });
        }
      });

      var map = new Map({
        //interactions: defaultInteractions().extend([select, modify]),
        interactions: defaultInteractions().extend([select]),
        layers: [layer],
        target: 'map',
        view: new View({
          center: [0, 1000000],
          zoom: 2
        })
      });
    },
    initMap() {
      let _this = this;
      //加载本地数据作为底图
      var baseLayer = new TileLayer({
         //source:new OSM({
         source: new XYZ({
          attributions: [],
          url: "/static/tiles/{z}/{x}/{y}.png",
          projection: "EPSG:4326",
          wrapX:false,
        })
      });
      var source = new VectorSource();
      var fees = new GeoJSON().readFeatures(_this.pieline,{
       dataProjection: "EPSG:3857",
       //featureProjection: "EPSG:3857"
      });
      // var fees = new EsriJSON().readFeatures(_this.pieline);
   

      source.addFeatures(fees);

      var geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857'
          }
        },
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [2e6*6, 2e6*7]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiPoint',
            'coordinates': [[-2e6, 0], [0, -2e6]]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[4e6, -2e6], [8e6, 2e6], [9e6, 2e6]]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[4e6, -2e6], [8e6, 2e6], [8e6, 3e6]]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [[[-5e6, -1e6], [-4e6, 1e6],
              [-3e6, -1e6], [-5e6, -1e6]], [[-4.5e6, -0.5e6],
              [-3.5e6, -0.5e6], [-4e6, 0.5e6], [-4.5e6, -0.5e6]]]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiLineString',
            'coordinates': [
              [[-1e6, -7.5e5], [-1e6, 7.5e5]],
              [[-1e6, -7.5e5], [-1e6, 7.5e5], [-5e5, 0], [-1e6, -7.5e5]],
              [[1e6, -7.5e5], [15e5, 0], [15e5, 0], [1e6, 7.5e5]],
              [[-7.5e5, -1e6], [7.5e5, -1e6]],
              [[-7.5e5, 1e6], [7.5e5, 1e6]]
            ]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiPolygon',
            'coordinates': [
              [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6],
                [-3e6, 6e6], [-5e6, 6e6]]],
              [[[-3e6, 6e6], [-2e6, 8e6], [0, 8e6],
                [0, 6e6], [-3e6, 6e6]]],
              [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6],
                [3e6, 6e6], [1e6, 6e6]]]
            ]
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'GeometryCollection',
            'geometries': [{
              'type': 'LineString',
              'coordinates': [[-5e6, -5e6], [0, -5e6]]
            }, {
              'type': 'Point',
              'coordinates': [4e6, -5e6]
            }, {
              'type': 'Polygon',
              'coordinates': [
                [[1e6, -6e6], [2e6, -4e6], [3e6, -6e6], [1e6, -6e6]]
              ]
            }]
          }
        }]
      };
      var geojsonObject1 = {
              'type': 'FeatureCollection',
              'crs': {
                'type': 'name',
                'properties': {
                  'name': 'EPSG:3857'
                }
              },
              'features': [{
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [104.089175,30.650451]
                  //'coordinates': [2e6*6, 2e6*7]
                  
                }
              }]
      };
      var source = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojsonObject1,{
       dataProjection: "EPSG:3857",
       featureProjection: "EPSG:3857"
      })
      });
      //控制线的样式
      var vector = new VectorLayer({
        source: source,
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color: "#ffcc33",
            width:  2
          }),
          image: new Icon({
            src: "./static/img/point.png"
          }),
          image: new CircleStyle({
            radius: 15,
            fill: new Fill({
              color: "#ffcc33"
            })
          })
        })
      });
      // console.log('_this.pieline',new EsriJSON().readFeatures(_this.pieline))
     //  获取这个图层上面加的点线信息 this.pielayer.getSource().getFeatures()
  
      //将地图展示出来
      _this.map = new Map({
        layers: [
          // openCycleMapLayer, openSeaMapLayer,
          baseLayer,
          vector
        ],	
        
        target: "map",
        // controls: defaultControls({
        //   attributionOptions: {
        //     // collapsible: false
        //   }
        // }),
        view: new View({
          //成都坐标 104.089175,30.650451
                              //51603249.291548766
         // center: fromLonLat([51661341.43304551, 13432126.106497452],"EPSG:4326","EPSG:3857"),
          //center:  [51661341.43304551, 13432126.106497452],
          //center:  fromLonLat([104.089175,30.650451],"EPSG:3857"),
          center: [104.089175,30.650451],
          // center: Map.proj.transform([104.06513083602707, 30.549362528549807],'EPSG:4326','EPSG:3857'),
          zoom: 8,
          projection:"EPSG:4326"

          // minZoom:7
        })
      }),

       _this.modify = new Modify({
        source: source
      });
      
      _this.modify.on('modifstart',evt=>{
        console.log('MODIFYSTART',evt)
      })
      // _this.map.addInteraction(_this.modify);
      var select = new Select({
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color: "#ffdd33",
            width:  4
          }),
          image: new Icon({
            src: "./static/img/point.png"
          }),
          image: new CircleStyle({
            radius: 25,
            fill: new Fill({
              color: "#ffdd33"
            })
          })
        })
      });
      _this.map.addInteraction(select);
      // _this.map.on("singleclick", evt => {
      //   var c = _this.map.getCoordinateFromPixel(evt.pixel);
      //   console.log("click Features",_this.map.getFeaturesAtPixel(evt.pixel));
      //   source.addFeatures(_this.map.getFeaturesAtPixel(evt.pixel));
      //         console.log("singleclick",evt);
      //         let num = 0;
      //         _this.map.forEachFeatureAtPixel(evt.pixel, fe => {
      //           if(evt.pixel){
      //             num += 1
      //           }
      //           // console.log('evt.pixel',fe,new GeoJSON().writeFeatureObject(fe))
      //         })
      //       });
     
    },
    //增加交互事件
    addInteractions() {
      let _this = this;
      _this.draw = new Draw({
        source: _this.source,
        type: _this.$parent.drawtype,
        stopClick: false
        // geometryFunction(sketchFeature,geometry){
        //   geometry == null ?  new Geometry():geometry
        //   console.log(sketchFeature,geometry) return geometry}
      });
      _this.snap = new Snap({
        source: _this.source
      });
      _this.map.addInteraction(_this.draw);
      _this.map.addInteraction(_this.snap);
      _this.draw.on("drawstart", evt => {
        _this.popupVisble = false;
      });
      _this.draw.on("drawend", evt => {
        let obj = new GeoJSON().writeFeatureObject(evt.feature);
        _this.alertDialog(obj);
      });
      //
      _this.modify.on('MODIFYSTART',evt=>{
        console.log('MODIFYSTART',evt)
      })
      _this.map.on("singleclick", evt => {
        console.log("singleclick",evt);
        let num = 0;
        _this.map.forEachFeatureAtPixel(evt.pixel, fe => {
          if(evt.pixel){
            num += 1
          }
          // console.log('evt.pixel',fe,new GeoJSON().writeFeatureObject(fe))
        })
      });
      //点拖动事件
      _this.map.on("pointerdrag", evt => {
        // console.log("pointerdrag", evt);
      });
    },
    drawStart() {
      let _this = this;
      _this.draw.on("drawstart", evt => {
        console.log("drawstart", evt);
      });
    },
    drawEnd(evt) {
      let _this = this;
      //将feature转为json对象，后台保存  ====  GeoJSON()  new EsriJSON().writeFeatureObject(evt.feature)
    },
    //弹出框
    alertDialog(evt) {
      //转 经纬度toLonLat(evt.coordinate)
      console.log(evt);
      let _this = this;
      _this.popupVisble = true;
      _this.coorObj = evt;    //将feature对象保存,给子组件传值,向后端发送
      //设置弹框
      var container = document.getElementById("popup");
      var content = document.getElementById("popup-content");
      var closer = document.getElementById("popup-closer");
      _this.overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });
      _this.map.addOverlay(_this.overlay);
      closer.onclick = function() {
        _this.overlay.setPosition(undefined);
        closer.blur();
        return false;
      };
      let coordinate = evt.geometry.coordinates;
      var hdms = toStringHDMS(toLonLat(coordinate));
      // content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
      if (evt.geometry.type == "Point") {
        _this.overlay.setPosition(coordinate);
        _this.$router.push("/map/Station")
      } else if(evt.geometry.type == "LineString"){
        _this.overlay.setPosition(coordinate[coordinate.length-1]);
        _this.$router.push("/map/Line")
      }
    },
    typechange() {
      let _this = this;
      console.log(_this.pielayer.getSource().getFeatures());
      _this.pielayer
        .getSource()
        .getFeatures()
        .map(evt => {
          console.log(evt);
          console.log("geometry", new GeoJSON().writeFeatureObject(evt));
        });
      _this.map.removeInteraction(_this.draw);
      _this.map.removeInteraction(_this.snap);
      _this.addInteractions();
    },
    addDraw() {
      let _this = this;
      _this.addInteractions();

      _this.map.addInteraction(_this.modify);
    },
    //不可编辑
    removeDraw() {
      let _this = this;
      _this.map.removeInteraction(_this.draw);
      _this.map.removeInteraction(_this.snap);
      _this.map.removeInteraction(_this.modify);
      _this.overlay.setPosition(undefined);
    },
    getData() {
      let _this = this;
      _this.axios.get("/MapData/AllVector?userId=userId",{
          userId:"userId",
        }).then(res => {
          console.log('res',res)
        _this.pieline = res.data.Data;
        this.initMap();
      });
    },
    removepoint() {
      console.log(4444);
      this.draw.removeLastPoint();
    }
  }
};
</script>

<style>
.index {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

#map {
  width: 100%;
  height: 100%;
}
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  /* min-width: 280px; */
  /* max-height: 200px; */
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>
