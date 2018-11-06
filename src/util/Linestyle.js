import { Circle as CircleStyle, Fill, Stroke, Style, Icon ,Text} from "ol/style.js";

//划线默认样式
const defaultStyle = new Style({
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
      font: "12px Calibri,sans-serif",
      overflow: true,
      fill: new Fill({
          color: "white"
      }),
  })
})

//选择选中过后样式;
const selectStyle = new Style({
    fill: new Fill({
      color: "green"
    }),
    stroke: new Stroke({
      color: "red",
      width:  4
    }),
    image: new Icon({
      imgSize: [ 20, 20],
      src: "./static/img/point.png"
    }),
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: "red"
      })
    })
  })


  const normalstyle = new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)"
    }),
    stroke: new Stroke({
      color: "#ffcc33",
      width: 4
    }),
    image: new Icon({
      src: "./static/img/point.jpg"
    }),
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: "#ffcc33"
      })
    })
  });
  const highlightstyle = new Style({
    stroke: new Stroke({
      color: "rgb(255,0,0,0.5)",
      width: 4
    }),
    fill: new Fill({
      color: "red"
    }),
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: "red"
      })
    })
  });


  export { defaultStyle ,selectStyle  }
