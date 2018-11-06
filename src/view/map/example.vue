<template>
<div id="map">

</div>
</template>

<script>
import Map from "ol/Map";
import View from "ol/View";
import { Tile as Tilelayer, Vector } from "ol/layer";
import arcgis from "ol/source/TileArcGISRest";
import { Vector as VectorSource } from "ol/source.js";
import { fromLonLat } from "ol/proj";
import { Style, Stroke, Icon, Text } from "ol/style.js";
import GeoJSON from "ol/format/GeoJSON.js";
import EsriJSON from "ol/format/EsriJSON";
import TileWMS from "ol/source/TileWMS.js";
import { Point, LineString } from "ol/geom.js";
import "ol/ol.css";

export default {
  data() {
    return {
      map: "",
      pielayer: "",
      highlightlayer: "",
      highlightfeature: "",
      pieline: {
        displayFieldName: "",
        fieldAliases: {
          FID: "FID",
          Id: "Id",
          name: "name"
        },
        geometryType: "esriGeometryPolyline",
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        },
        fields: [
          {
            name: "FID",
            type: "esriFieldTypeOID",
            alias: "FID"
          },
          {
            name: "Id",
            type: "esriFieldTypeInteger",
            alias: "Id"
          },
          {
            name: "name",
            type: "esriFieldTypeString",
            alias: "name",
            length: 50
          }
        ],
        features: [
          {
            attributes: {
              FID: 0,
              Id: 0,
              name: "管廊04"
            },
            geometry: {
              paths: [
                [
                  [104.06171868894472, 30.549362528549807],
                  [104.06513083602707, 30.549362528549807]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 1,
              Id: 0,
              name: "管廊06"
            },
            geometry: {
              paths: [
                [
                  [104.066701280291, 30.549362528549807],
                  [104.0687476752843, 30.549369759627545]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 2,
              Id: 0,
              name: "管廊02"
            },
            geometry: {
              paths: [
                [
                  [104.06671786659751, 30.548043917178802],
                  [104.06673976911965, 30.546302666668581]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 3,
              Id: 0,
              name: "管廊09"
            },
            geometry: {
              paths: [
                [
                  [104.06485481855039, 30.544822516950603],
                  [104.06143315362397, 30.544822516950603]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 4,
              Id: 0,
              name: "管廊12"
            },
            geometry: {
              paths: [
                [
                  [104.06723427955622, 30.544822516950603],
                  [104.0711270777619, 30.544822516950603]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 5,
              Id: 0,
              name: "管廊08"
            },
            geometry: {
              paths: [
                [
                  [104.06675838735509, 30.544822516950603],
                  [104.06691543178147, 30.537769794529424]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 6,
              Id: 0,
              name: "管廊"
            },
            geometry: {
              paths: [
                [
                  [104.066701280291, 30.549362528549807],
                  [104.06662989646077, 30.553231532145389]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 7,
              Id: 0,
              name: "管廊07"
            },
            geometry: {
              paths: [
                [
                  [104.0687476752843, 30.549369759627545],
                  [104.07074160507875, 30.549376805315887]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 8,
              Id: 0,
              name: "管廊05"
            },
            geometry: {
              paths: [
                [
                  [104.06513083602707, 30.549362528549807],
                  [104.066701280291, 30.549362528549807]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 9,
              Id: 0,
              name: "管廊01"
            },
            geometry: {
              paths: [
                [
                  [104.066701280291, 30.549362528549807],
                  [104.06671786659754, 30.548043917178806]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 10,
              Id: 0,
              name: "管廊03"
            },
            geometry: {
              paths: [
                [
                  [104.06673976911965, 30.546302666668581],
                  [104.06675838735509, 30.544822516950603]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 11,
              Id: 0,
              name: "管廊10"
            },
            geometry: {
              paths: [
                [
                  [104.06675838735509, 30.544822516950603],
                  [104.06485481855039, 30.544822516950603]
                ]
              ]
            }
          },
          {
            attributes: {
              FID: 12,
              Id: 0,
              name: "管廊11"
            },
            geometry: {
              paths: [
                [
                  [104.06675838735509, 30.544822516950603],
                  [104.06723427955622, 30.544822516950603]
                ]
              ]
            }
          }
        ]
      },
      piewell: {
        displayFieldName: "",
        fieldAliases: {
          FID: "FID",
          Id: "Id",
          name: "name"
        },
        geometryType: "esriGeometryPoint",
        spatialReference: {
          wkid: 4326,
          latestWkid: 4326
        },
        fields: [
          {
            name: "FID",
            type: "esriFieldTypeOID",
            alias: "FID"
          },
          {
            name: "Id",
            type: "esriFieldTypeInteger",
            alias: "Id"
          },
          {
            name: "name",
            type: "esriFieldTypeString",
            alias: "name",
            length: 50
          }
        ],
        features: [
          {
            attributes: {
              FID: 0,
              Id: 0,
              name: "管井006"
            },
            geometry: {
              x: 104.06513083602707,
              y: 30.549362528549807
            }
          },
          {
            attributes: {
              FID: 1,
              Id: 0,
              name: "管井005"
            },
            geometry: {
              x: 104.0687476752843,
              y: 30.549369759627545
            }
          },
          {
            attributes: {
              FID: 2,
              Id: 0,
              name: "管井001"
            },
            geometry: {
              x: 104.066701280291,
              y: 30.549362528549807
            }
          },
          {
            attributes: {
              FID: 3,
              Id: 0,
              name: "管井002"
            },
            geometry: {
              x: 104.06671786659751,
              y: 30.548043917178802
            }
          },
          {
            attributes: {
              FID: 4,
              Id: 0,
              name: "管井003"
            },
            geometry: {
              x: 104.06673976911965,
              y: 30.546302666668581
            }
          },
          {
            attributes: {
              FID: 5,
              Id: 0,
              name: "管井004"
            },
            geometry: {
              x: 104.06675838735509,
              y: 30.544822516950603
            }
          },
          {
            attributes: {
              FID: 6,
              Id: 0,
              name: "管井008"
            },
            geometry: {
              x: 104.06723427955622,
              y: 30.544822516950603
            }
          },
          {
            attributes: {
              FID: 7,
              Id: 0,
              name: "管井007"
            },
            geometry: {
              x: 104.06485481855039,
              y: 30.544822516950603
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      var _this = this;
      var baseLayer = new Tilelayer({
        title: "ArcGIS底图",
        layerType: "base",
        source: new arcgis({
          url:
            "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer"
        })
      });
      _this.highlightlayer = new Vector({
        source: new VectorSource({
          features: []
        })
      });
      _this.map = new Map({
        target: "map",
        layers: [baseLayer],
        //controls: [],
        view: new View({
          center: fromLonLat([104.06513083602707, 30.549362528549807]),
          //extent:ol.proj.fromLonLat([102.20597897501156, 27.939772218085974, 102.22645185750577,  27.94778148383161]),
          zoom: 17,
          minZoom: 12
        })
      });
      _this.map.on("singleclick", evt => {
          console.log(evt)
        _this.map.forEachFeatureAtPixel(evt.pixel, fe => {
            console.log('evt.pixel',evt.pixel,fe)
          if (_this.highlightfeature) {
            _this.highlightfeature.setStyle(
              _this.highlightfeature.get("normalstyle")
            );
          }
          fe.setStyle(fe.get("highlightstyle"));
          _this.highlightfeature = fe;
          var geom = fe.getGeometry();
          if (geom instanceof Point) {
            //井
            console.log("井" + fe.get("编号"));
          } else if (geom instanceof LineString) {
            //管线
            console.log("管线" + fe.get("编号"));
          }
          _this.formatFeatureTojson(fe);
        });
      });
      var vectorSource = new VectorSource({
        features: []
      });
      var vectorLayer = new Vector({
        source: vectorSource
      });
      _this.pielayer = vectorLayer;
      _this.map.addLayer(vectorLayer);
      var fes = new EsriJSON().readFeatures(_this.piewell, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857"
      });
      console.log("fes",fes)
      fes.map(function(fe, i) {
          console.log("fe,i",fe,i)
        var normalstyle = new Style({
          image: new Icon({
            imgSize:[10,10],
            src: "./static/img/point.jpg"
          }),
          text: new Text({
            text: fe.get("name")
          })
        });
        var highlightstyle = new Style({
          image: new Icon({
            imgSize:[10,10],
            src: "./static/img/point.jpg",
            scale: 1.4
          }),
          text: new Text({
            text: fe.get("name")
          })
        });
        fe.set("normalstyle", normalstyle);
        fe.set("highlightstyle", highlightstyle);
        fe.setStyle(normalstyle);
      });
      vectorSource.addFeatures(fes);

      var fees = new EsriJSON().readFeatures(_this.pieline, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857"
      });
      fees.map(function(fe, index) {
        var normalstyle = new Style({
          stroke: new Stroke({
            color: "rgb(120,0,0,0.5)",
            width: 2
          })
        });
        var highlightstyle = new Style({
          stroke: new Stroke({
            color: "rgb(255,0,0,0.5)",
            width: 10
          })
        });
        fe.set("normalstyle", normalstyle);
        fe.set("highlightstyle", highlightstyle);
        fe.setStyle(normalstyle);
      });
      vectorSource.addFeatures(fees);
    },
    searchFeatures(keyword) {
      var _this = this;
      var features = this.pielayer.getSource().getFeatures();
      var searchedfe = features.forEach(function(fe, index) {
        if (_this.highlightfeature) {
          _this.highlightfeature.setStyle(
            _this.highlightfeature.get("normalstyle")
          );
        }
        if (fe.get("name") === keyword) {
          var geom = fe.getGeometry();
          if (geom instanceof Point) {
            //井
            _this.map.getView().animate({
              center: geom.getCoordinates(),
              duration: 500
            });
          } else if (geom instanceof LineString) {
            //管线
            var extent = geom.getExtent();
            _this.map.getView().animate({
              center: [
                (extent[0] + extent[2]) / 2,
                (extent[1] + extent[3]) / 2
              ],
              duration: 500
            });
          }
          _this.formatFeatureTojson(fe);
          fe.setStyle(fe.get("highlightstyle"));
          _this.highlightfeature = fe;
          return;
        }
      });
    },
    formatFeatureTojson(feature) {
      this.$parent.getFParams(feature.get("name"));
    },
    flyto() {
      if (this.highlightfeature) {
        this.highlightfeature.setStyle(
          this.highlightfeature.get("normalstyle")
        );
      }
      var features = this.pielayer.getSource().getFeatures();
      var randomnum = this.randomNum(0, features.length);
      var fe = features[randomnum];
      var geom = fe.getGeometry();
      if (geom instanceof Point) {
        //井
        this.map.getView().animate({
          center: geom.getCoordinates(),
          duration: 500,
          zoom: 19
        });
      } else if (geom instanceof LineString) {
        //管线
        var extent = geom.getExtent();
        this.map.getView().animate({
          center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
          duration: 500,
          zoom: 19
        });
      }

      fe.setStyle(fe.get("highlightstyle"));
      this.highlightfeature = fe;
      return;
    },
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    }
  }
};
</script>

<style scoped>
#map {
  height: 100%;
}
</style>
