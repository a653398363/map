<template>
  <div class="index">
      <div id="map" class="map" v-loading="loading"></div>
      <div id="popup" class="ol-popup" v-show="showmsg">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content">
            <router-view ref="details" :detailObj="detailObj"></router-view>
        </div>
      </div>
      <div class="workArea">
        <el-menu default-active="1-4-1"  class="el-menu-vertical-demo"
         @open="handleOpen"  @close="handleClose" @select="selectFloor" :collapse="isCollapse"
         background-color="#545c64"
          text-color="#fff"  
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">关注</span>
            </template>
              <el-transfer v-model="value1" :data="Alldata"
              :titles="['未关注', '关注']"></el-transfer>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">作业区</span>
            </template>
            <el-menu-item-group index="1-4">
             <el-menu-item-group>
                <el-menu-item index="2-1">******</el-menu-item>
                <el-menu-item index="2-2">****区</el-menu-item>
              </el-menu-item-group>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="floor">
        <el-radio-group v-model="checkboxGroup1" @change="changeFloor">
          <el-radio-button v-for="city in selectOptions" :label="city" :key="city">{{city}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="notice" >
        <el-badge :value="6" class="item" :title="'报警消息'">
          <el-button type="danger" icon="el-icon-warning" circle @click="showNoticeList =!showNoticeList"></el-button>
        </el-badge>
        <div class="noticelist" v-show="!showNoticeList">
          <ul>
            <li>
              <span ><i class="el-icon-warning typecolor"></i> 
            池浅2井压力500</span>
             
             <span class="details">压力超标压力超标压力超标压力超标</span> </li>
            <li>
             <span ><i class="el-icon-info typecolor"></i>***</span>
             <span class="details">压力超标</span> </li>
            <li>
             <span ><i class="el-icon-warning typecolor"></i> *****</span>
             <span class="details">压力超标压力超标压力超标压力超标</span> </li>
            <li>
             <span > <i class="el-icon-info typecolor"></i>****</span>
             <span class="details">气压不正常</span> </li>
            <li>
             <span ><i class="el-icon-circle-close typecolor"></i> ****</span>
             <span class="details">压力超标压力超标压力超标压力超标</span> </li>
            <li>
             <span ><i class="el-icon-question typecolor"></i> ***</span>
             <span class="details">压力超标压力超标压力超标压力超标</span> </li>
          </ul>
        </div>
        <div class="rotate" v-show="!showNoticeList"></div>
      </div>
      <div class="picture">
        <el-button type="info" icon="el-icon-message" circle :title="'站点图层'" @click="pictureShow = !pictureShow"></el-button>
        <div class="pictureback" v-show="pictureShow">
          <img src="../../assets/picture.png" alt="">
        </div>
        <div class="rotateleft" v-show="pictureShow"></div>
      </div>
  </div>
</template>

<script>
import preStation from "@/view/preview/preStation/index.vue"
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
import { Circle as CircleStyle, Fill, Stroke, Style, Icon ,Text} from "ol/style.js";
import XYZ from "ol/source/XYZ";
import { defaultStyle , selectStyle} from "@/util/Linestyle.js";
import { infoMessage } from '@/util/message.js';
export default {
  components:{
    preStation
  },
  data() {
   
    return {
      map: "",
      draw: "",
      detailObj:{},
      select:"",
      pielayer: "",
      popupVisble: false,
      overlay: "", //弹出框
      snap: "",
      source: "",
      pieline: {},
      showmsg: false,
      isCollapse: true,
      value1: [1,4],
      Alldata:[],
      checkboxGroup1:'一',
      selectOptions:['一',"二","三"],
      loading: false,
      showNoticeList: true,
      searchData:{
        LineString:[],
        Point:[],
      },
      pictureShow: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    generateData(){
      this.searchData.map(item=>{
        this.Alldata.push({
          key:item.properties.dataId,
          label: item.properties.dataName, 
        }) 
      })
    },
    getData(display) {
      if(!display){
        display = '1'
      }
      let _this = this;
      _this.loading = true;
      _this.axios
        .get("/MapData/AllVector?userId=userId&display="+display,{ params:{
          userId: "userId",
          display: display
        }})
        .then(res => {
          _this.pieline = res.data.Data;
          _this.loading = false;
          this.initMap();
          console.log(_this.pieline)
          _this.searchData =JSON.parse(JSON.stringify(_this.pieline.features)); 
          _this.generateData()
          _this.$parent.getSearch();
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
      let fees = new GeoJSON().readFeaturesFromObject(_this.pieline)
      fees.map(item=>{
        _this.textStyle(item)
      })
      //显示数据源
      _this.source = new VectorSource({
          features: fees
      });
      //控制线的样式
      var vector = new VectorLayer({
        source: _this.source,
        // style: defaultStyle
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

     _this.map.on("singleclick",evt =>{
       console.log('singleclick',evt)
        _this.map.forEachFeatureAtPixel(evt.pixel, fe => {
          _this.hoverMsg(evt) 
          _this.detailObj = fe;
          let obj = new GeoJSON().writeFeatureObject(fe);
          console.log("obj",obj)
          if(obj.geometry.type == 'LineString'){
            _this.$router.push("/GWJK/preview/Line")
          }else if(obj.geometry.type == 'Point'){
            _this.$router.push("/GWJK/preview/Station")
          }
          console.log('fe',fe)
        })
     })
    },
    textStyle(feature){
       var  textStyle = new Style({
            //填充颜色;
            fill: new Fill({
                color: "rgba(255, 255, 255, 0.2)"
            }),
            //线颜色
            stroke: new Stroke({
                color: "#ffcc33",
                width: 4
            }),
            image: new Icon({
                imgSize: [ 10 , 10],
                src: "./static/img/point.jpg"
            }),
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: "#ffcc33"
              })
            }),
            text: new Text({
                  textAlign: "center",
                  //offsetY: offY,
                  //offsetX: offX,
                  textBaseline: "middle",
                  text: feature.values_.dataName,
                  font: "12px Calibri,sans-serif",
                  overflow: true,
                  fill: new Fill({
                      color: "white"
                  }),
              })
           
          })
      return feature.setStyle(textStyle)
    },
    //查询
    searchFeatures(keyword,type) {
      console.log(keyword,type)
      var _this = this;
      let Isdata = false;
      var features = this.pielayer.getSource().getFeatures();
      var searchedfe = features.forEach(function(fe, index) {
        _this.textStyle(fe)
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

    hoverMsg(evt){
      let _this = this
      // obj = new GeoJSON().writeFeatureObject(this.delte.selected[0]);
      
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
      _this.showmsg = true;
      closer.onclick = function() {
        _this.overlay.setPosition(undefined);
        closer.blur();
        return false;
      };
      let coordinate = evt.coordinate;
      // content.innerHTML = "<p>You clicked here:</p><code>" + coordinate + "</code>";
      _this.overlay.setPosition(coordinate);
    },
    //保存后，返回数据添加到 feature中
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    selectFloor(key, keyPath){
      console.log(key, keyPath);
    },
    changeFloor(item){
      if(item == "一"){
        this.getData('1')
      }else if(item == "二"){
        this.getData("2")
      }else if(item == "三"){
        this.getData("3")
      }
    }
  }
};
</script>

<style>
.index {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
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
.workArea{
  position: absolute;
  left: 20px;
  top: 160px;
}
.floor{
  position: absolute;
  right: 20px;
  top: 160px;
  color: white;
}
.el-radio-button{
  display: block;
}
.el-radio-button__inner{
  padding: 12px;
}
.notice{
  position: absolute;
  right: 20px;
  bottom: 30px;
}
.notice .item{
  position: relative;
}
.notice .noticelist{
  width: 350px;
  max-height: 350px;
  background-color: white;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  overflow-y: hidden;
  position: absolute;
  right: 0px;
  bottom: 55px;
}

.rotate {
  position: absolute;
  bottom: 48px;
  right: 9px;
  width: 20px;
  height: 20px;
  background-color: white;
  -webkit-transform: rotate(41deg);
  transform: rotate(45deg);
}
.rotateleft{
  position: absolute;
  bottom: 48px;
  right: 9px;
  width: 20px;
  height: 20px;
  background-color: white;
  -webkit-transform: rotate(41deg);
  transform: rotate(45deg);
}
.notice .noticelist ul{
  width: 100%;
  max-height: 320px;
  box-sizing: border-box;
}

.notice .noticelist ul li{
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  border-bottom: 1px solid #dcdfe6;
  font-size: 12px;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  outline: 0;
  padding: 0 20px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
  
} 
.notice .noticelist ul li span{
  width: 45%;
  height: 35px;
  line-height: 35px;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.notice .noticelist ul li .details{
  width: 40%;
  height: 35px;
  line-height: 35px;
  margin-left: 30px;
}
.typecolor{
  color: #f56c6c
}
.picture{
  position: absolute;
  left: 20px;
  bottom: 30px;
}
.pictureback{
  height: 200px;
  box-sizing: border-box;
  border-radius: 4px;
  overflow-y: hidden;
  position: absolute;
  left: 0px;
  bottom: 57px;
  z-index: 2;
}
.pictureback img{
  width: 360px;
  height: 200px;
}
.el-menu--collapse{
  width: 40px;
}
.el-menu-item, .el-submenu__title{
  height: 40px!important;
  line-height: 40px!important;
  padding-left: 10px!important;
}
</style>
