<template>
  <div class="index">
        <div id="map" class="map"></div>
        <div>
          <router-view ref="saveTab" :coorObj="coorObj"></router-view>
        </div>
    <!-- <div id="popup" class="ol-popup" >
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content">
           <router-view ref="saveTab" :coorObj="coorObj"></router-view> 
      </div>
    </div> -->
  </div>
</template>

<script>
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay.js";
import { defaults as defaultControls } from "ol/control.js";
import Point from "ol/geom/Point.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { Draw, Modify, Snap, Select, DragBox } from "ol/interaction.js";
import OSM, { ATTRIBUTION } from "ol/source/OSM.js";
import TileJSON from "ol/source/TileJSON.js";
import { toStringHDMS } from "ol/coordinate.js";
import { toStringXY } from "ol/coordinate";
import {fromLonLat,addProjection,addCoordinateTransforms,transform,toLonLat} from "ol/proj";
import Feature from "ol/Feature.js";
import EsriJSON from "ol/format/EsriJSON";
import GeoJSON from "ol/format/GeoJSON";
import { Vector as VectorSource } from "ol/source.js";
import { platformModifierKeyOnly } from "ol/events/condition.js";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style.js";
import XYZ from "ol/source/XYZ";
import { defaultStyle , selectStyle} from "@/util/Linestyle.js";
import { infoMessage } from '@/util/message.js';
export default {
  data() {
    return {
      map: "",
      draw: "",
      select:"",
      pielayer: "",
      cancelDraw: "",
      dataBack:[],  //保存数据后回填
      delte:[],
      ModifyFlag: false,
      show2: false,
      Isupdate: false,
      popupVisble: false,
      coorObj: {}, //需要保存的坐标数据对象
      modify: "",
      overlay: "", //弹出框
      snap: "",
      source: "",
      selectedFeatures: "",
      overlay: "",
      pieline: {},
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let _this = this;
      _this.axios
        .get("/MapData/AllVector?userId=userId", {
          userId: "userId"
        })
        .then(res => {
          console.log('alldata',res)
          _this.pieline = res.data.Data;
          this.initMap();
        });
    },
    initMap() {
      let _this = this;
      //加载本地数据作为底图
      var baseLayer = new TileLayer({
        // source:new OSM()
        source: new XYZ({
          attributions: [],
          url: "./static/map/tiles/{z}/{x}/{y}.png",
        })
      });

      //显示数据源
      var fees = new GeoJSON().readFeaturesFromObject(_this.pieline);
      _this.source = new VectorSource({
          features: fees
      });
      //控制线的样式
      var vector = new VectorLayer({
        source: _this.source,
        style: defaultStyle
      });
      //  获取这个图层上面加的点线信息 this.pielayer.getSource().getFeatures()
      _this.pielayer = vector;
      //将地图展示出来
      _this.map = new Map({
        layers: [
          baseLayer,
          vector
        ],
        target: "map",
        view: new View({
          //成都坐标 
          center: fromLonLat([104.089175,30.650451]),
          // center: fromLonLat([51661341.43304551, 13432126.106497452],"EPSG:4326","EPSG:3857"),
          zoom: 11,
          minZoom: 9,
          maxZoom:  13
        })
      });

      _this.select = new Select({
        style: selectStyle
      });
      // _this.map.addInteraction(_this.select);

      //选中修改
       _this.modify = new Modify({
        features: _this.select.getFeatures(),
        insertVertexCondition: function() {
          // prevent new vertices to be added to the polygons
          return !_this.select.getFeatures().getArray().every(function(feature) {
            return feature.getGeometry().getType().match(/Polygon/);
          });
        }
      });
    },

    //增加交互事件
    addInteractions() {
      let _this = this;
      _this.draw = new Draw({
        source: _this.source,
        type: _this.$parent.drawtype,
        stopClick: true
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
        console.log('drawend',evt)
        _this.cancelDraw = evt.feature;
        let obj = new GeoJSON().writeFeatureObject(evt.feature);
        _this.Isupdate = false;
        _this.alertDialog(obj);
      });
      //
      _this.select.on('select', evt => {
        _this.$parent.delete_box = true;
        console.log("slect",evt)
        //select 选中有值
        if(evt.selected.length != 0){
          evt.selected[0].setStyle(selectStyle)
          _this.$parent.stationname = evt.selected[0].values_.dataName
          _this.$parent.delete_box = true;
          _this.delte = evt;
          let obj = new GeoJSON().writeFeatureObject(evt.selected[0]);
          _this.GoPath(obj)

        }else{
          _this.$parent.delete_box = false;
        }
        //取消刚才被选中的线的样式;
        if(evt.deselected.length != 0){
          evt.deselected[0].setStyle(defaultStyle);
        }
        //判断是否是修改后保存
        if(_this.ModifyFlag == true){
          if(evt.deselected.length!=0){
            let obj = new GeoJSON().writeFeatureObject(evt.deselected[0]);
            _this.dirctModify(obj);
            _this.ModifyFlag == false;
          }
        }
      });
      //开始修改操作
      _this.modify.on("modifystart", evt => {
        let obj = new GeoJSON().writeFeatureObject(evt.features.array_[0]);
        if (obj.geometry.type == "Point") {
          _this.$router.push("/GWJK/edit/Station");
        } else if (obj.geometry.type == "LineString") {
          _this.$router.push("/GWJK/edit/Line");
        }
      });
      _this.modify.on("modifyend", evt => {
        _this.ModifyFlag = true
      });
 
    },
    //删除刚才画的
    drawEnd() {
      let _this = this;
      _this.pielayer.getSource().removeFeature(_this.cancelDraw)
    },
    //查询
    searchFeatures(keyword) {
      console.log(keyword)
      var _this = this;
      let Isdata = false;
      var features = this.pielayer.getSource().getFeatures();
      var searchedfe = features.forEach(function(fe, index) {
        fe.setStyle(defaultStyle)
        if( fe.values_.dataName == keyword){
          console.log(fe)
          Isdata  = true
          fe.setStyle(selectStyle)
        }
      });
      if(Isdata === false){
        infoMessage("没有数据")
      }
    },
    //弹出框
    alertDialog(evt) {
      //转 经纬度toLonLat(evt.coordinate)
      let _this = this;
      _this.coorObj = evt;
      if (evt.geometry.type == "Point") {
        _this.$router.push("/GWJK/edit/Station");
        _this.$refs.saveTab.popupVisble = true;
      } else if (evt.geometry.type == "LineString") {
        _this.$router.push("/GWJK/edit/Line");
        _this.$refs.saveTab.popupVisble = true;
      }
    },
    //修改后，select失去直接保存
    dirctModify(evt){
      //转 经纬度toLonLat(evt.coordinate)
      let _this = this;
      _this.coorObj = evt;
      _this.Isupdate = true;
      _this.ModifyFlag = false;
      if (evt.geometry.type == "Point") {
        _this.$router.push("/GWJK/edit/Station");
        _this.$refs.saveTab.saveInfo(evt)
      } else if (evt.geometry.type == "LineString") {
        _this.$router.push("/GWJK/edit/Line");
        _this.$refs.saveTab.saveInfo(evt)
      }
    },
    typechange() {
      let _this = this;
      _this.pielayer.getSource().getFeatures().map(evt => {
        });
      _this.map.removeInteraction(_this.draw);
      _this.map.removeInteraction(_this.snap);
      _this.map.removeInteraction(_this.modify);
      _this.map.removeInteraction(_this.select);
      _this.addInteractions();
    },
    canmodify() {
      let _this = this;
      _this.map.removeInteraction(_this.draw);
      _this.map.removeInteraction(_this.snap);
      _this.map.addInteraction(_this.select);
      _this.map.addInteraction(_this.modify);
    },
    //不可编辑
    removeDraw() {
      let _this = this;
      _this.map.removeInteraction(_this.draw);
      _this.map.removeInteraction(_this.snap);
      _this.map.removeInteraction(_this.modify);
      _this.popupVisble = false;
    },
    removeLast() {
      let _this = this;
      let feaData =  _this.pielayer.getSource().getFeatures();
      let obj = _this.delte.selected[0]
      _this.pielayer.getSource().removeFeature(obj)
    },
    GoPath(evt){
      let _this = this;
      if (evt.geometry.type == "Point") {
        _this.$router.push("/GWJK/edit/Station");
      } else if (evt.geometry.type == "LineString") {
        _this.$router.push("/GWJK/edit/Line");
      }
    },
    ISdelet(){
      let obj = new GeoJSON().writeFeatureObject(this.delte.selected[0]);
      this.coorObj = obj;
      this.$refs.saveTab.deletes(obj);
    },
    showDiag(){
      let obj = new GeoJSON().writeFeatureObject(this.delte.selected[0]);
      this.Isupdate = true;
      this.coorObj = obj;
      this.$refs.saveTab.popupVisble = true;
    },
    watchobj(){
      this.$refs.map.watchCzdm();
    },
    hoverMsg(){
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
      _this.overlay.setPosition(coordinate);
    },
    //保存后，返回数据添加到 feature中
    datareturn(data){
      let _this = this;
      let feaData =  _this.pielayer.getSource().getFeatures();
      let obj = _this.dataBack
      feaData.map(item =>{
        if( !item.id_ ){
          item.id_ = data.id;
          for(var i in data.properties){
            item.values_[i] = data.properties[i]
          }
        }
      })
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
  z-index: 10;
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
