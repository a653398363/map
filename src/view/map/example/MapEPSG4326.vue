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
import MousePosition from 'ol/control/MousePosition.js';


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
    //this.getData();
    this.initMap();
  },
  watch: {
    // "Ismodify"(Ismodify){
    //   console.log("Ismodify",Ismodify)
    // }
  },
  methods: {
    creadlay() {
      
    },
    
    initMap() {
      let _this = this;
      //加载本地数据作为底图
      var baseLayer = new TileLayer({
         //source:new OSM({
         source: new XYZ({
          attributions: [],
          url: "/static/tiles/{z}/{x}/{y}.png",
          projection: "EPSG:4326",//默认值EPSG:3875
          wrapX:false,
        })
      })
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
                  },
                },      
                {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'LineString',
                    'coordinates': [[104,30], [105,31], [105,30]]
                  }
                }]
      };
      var source = new VectorSource({
          features: (new GeoJSON()).readFeatures(geojsonObject1,{
        //  dataProjection: "EPSG:3857",
        //  featureProjection: "EPSG:3857"
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
            width:  4
          }),
          image: new Icon({
            src: "./static/img/point.png"
          }),
          image: new CircleStyle({
            radius: 7,
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
        controls:[
                new MousePosition({
              //coordinateFormat: coordinate.createStringXY(6),
              projection: 'EPSG:4326',
              className: 'custom-mouse-position',
              target: document.getElementById('mouse-position')
            }),
         ],   
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
      });

 

     
      
      //选中
      var select = new Select({
        // condition: function(evt) {
          // console.log("evt.originalEvent.type",evt.originalEvent.type)
          // //控制那些事件有效
          // //注册事件
          // var isOk = (evt.originalEvent.type == 'pointermove'
          //             || evt.originalEvent.type == 'pointerdown'
          //             || evt.originalEvent.type == 'pointerup'
          //             );
          //   return isOk;         },
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color: "red",
            width:  4
          }),
          image: new Icon({
            src: "./static/img/point.png"
          }),
          image: new CircleStyle({
            radius: 9,
            fill: new Fill({
              color: "red"
            })
          })
        })
      });
      _this.map.addInteraction(select);

           //编辑modify
       _this.modify = new Modify({
        source: source
      });
      //选中修改
       _this.modify = new Modify({
        features: select.getFeatures(),
        //style: overlayStyle,
        insertVertexCondition: function() {
          // prevent new vertices to be added to the polygons
          return !select.getFeatures().getArray().every(function(feature) {
            return feature.getGeometry().getType().match(/Polygon/);
          });
        }
      });
      _this.modify.on('modifystart',evt=>{
        console.log('MODIFYSTART',evt)
      });
       _this.map.addInteraction(_this.modify);

      var draw = new Draw({
          source: _this.source,
          type: "Point"
        });
      _this.map.addInteraction(draw); 
     // 
           //吸附效果
      var snap = new Snap({
              source: _this.source
            });
     _this.map.addInteraction(snap);
  
    },
    
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
