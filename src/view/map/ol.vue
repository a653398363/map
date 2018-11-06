<template>
    <div >
        <div id="map"></div>
    </div>
</template>
<script>
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay.js";
import { defaults as defaultControls } from "ol/control.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { Draw, Modify, Snap, Select , DragBox} from "ol/interaction.js";
import OSM, { ATTRIBUTION } from "ol/source/OSM.js";
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
import { Vector as VectorSource } from "ol/source.js";
import {platformModifierKeyOnly} from 'ol/events/condition.js';
import { Circle as CircleStyle, Fill, Stroke, Style ,Icon} from "ol/style.js";
export default {
    data(){
        return{
            pieline:'',
        }
    },
    created(){
        this.getData()
    },
    methods:{
      initMap(){
            var baseLayer = new TileLayer({
                // source:new OSM()
                source: new OSM({
                attributions: [],
                url: "/static/tiles/{z}/{x}/{y}.png"
                })
            });
            var source = new VectorSource({
                format: new GeoJSON()
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
                    radius: 5,
                    fill: new Fill({
                    color: "#ffcc33"
                    })
                })
                })
            });
            var pielayer = vector;    
            var map = new Map({
                layers: [
                baseLayer,
                vector
                ],
                target: "map",
                view: new View({
                center: fromLonLat([51661341.43304551, 13432126.106497452],"EPSG:4326","EPSG:3857"),
                zoom: 8
                })
            });
            var modify = new Modify({
                source: source
            });
            var draw = new Draw({
                source: source,
                type: "Point",
            });
            map.addInteraction(draw);
            var snap = new Snap({
                source: source
            });
            map.addInteraction(snap); 
            var select = new Select();
            map.addInteraction(select);

            var fees = new GeoJSON().readFeaturesFromObject(this.pieline);
      // var fees = new EsriJSON().readFeatures(_this.pieline);
      fees.map(function(fe, index) {
        console.log("fe",fe)
        var normalstyle = new Style({
          stroke: new Stroke({
            color: "green",   //rgb(120,0,0,0.5)
            width: 2,
          }),
          image: new Icon({
            imgSize: [10,10],
            src: "./static/img/point.jpg"
          }),
        });
        var highlightstyle = new Style({
          stroke: new Stroke({
            color: "rgb(255,0,0,0.5)",
            width: 4
          }),
        });
        fe.set("normalstyle", normalstyle);
        fe.set("highlightstyle", highlightstyle);
        fe.setStyle(normalstyle);
      });
         source.addFeatures(fees);
         var   modify = new Modify({
            source:source
        });
        map.addInteraction(modify); 
            map.on("singleclick", evt => {
                console.log("singleclick",evt);

                map.forEachFeatureAtPixel(evt.pixel, fe => {
                    console.log('fe',fe)

                    console.log('evt.pixel',geom,new GeoJSON().writeFeatureObject(fe))
                })
            });
      },
    getData() {
        let _this = this;
        _this.axios.get("/MapData/AllVector?userId=userId",{
            userId:"userId",
            }).then(res => {
            console.log('res',res)
            _this.pieline = res.data.Data;
            _this.initMap();
      });
    },
    }
}
</script>
<style scoped>
#map{
  height: 100%;
}
</style>

