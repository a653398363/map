(function(name) {
  function init() {
    var epsg = "EPSG:" + epsgCode;
    var projection = ol.proj.get(epsg);
    var url = outputPath;
    if (urlType == "0") {
      url += "{z}/{x}/{y}" + format;
    } else if (urlType == "1") {
      url += "{z}/{y}/{x}" + format;
    } else if (urlType == "2") {
      url += "{z}/{x}/{x}_{y}" + format;
    } else if (urlType == "3") {
      url += "{z}/{x}/{-y}" + format;
    }

    // 初始化显示视图
    view = new ol.View({
      center: ol.proj.transform([centX, centY], "EPSG:4326", epsg),
      projection: projection,
      zoom: maxZoom,
      minZoom: minZoom
    });
    console.log(33333);
    // 初始化地标图层
    var icons = new Array();

    var iconStyle = new ol.style.Style({
      image: new ol.style.Icon(
        /** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: "data/icon.png"
        })
      )
    });

    if (pointsStr != "") {
      var points = pointsStr.split("##");
      for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var info = point.split("$");
        var icon = new ol.Feature({
          geometry: new ol.geom.Point([
            parseFloat(info[1]),
            parseFloat(info[0])
          ]),
          name: info[2],
          population: 4000,
          rainfall: 500
        });

        icon.setStyle(iconStyle);
        icons[i] = icon;
      }
    }

    var vectorSource = new ol.source.Vector({
      features: icons
    });

    var vectorLayer = new ol.layer.Vector({
      source: vectorSource
    });

    // 初始化地图
    map = new ol.Map({
      target: "map",
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen(),
        new ol.control.OverviewMap(),
        new ol.control.ScaleLine(),
        new ol.control.MousePosition({
          coordinateFormat: ol.coordinate.createStringXY(6),
          projection: ol.proj.get("EPSG:4326"),
          className: "custom-mouse-position",
          target: document.getElementById("mouse-position")
        })
      ]),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            attributions:
              '<a href="http://www.arctiler.com/">太乐地图</a> © 2016',
            minZoom: minZoom,
            maxZoom: maxZoom,
            projection: projection,
            tileSize: tileSize,
            url: url
          })
        }),
        vectorLayer
      ],
      loadTilesWhileAnimating: true,
      target: document.getElementById("map"),
      view: view
    });

    // 地标相关
    markers();
  }

  /******************************************************************************************************************
											          地标相关
******************************************************************************************************************/

  function markers() {
    var element = document.getElementById("popup");

    var popup = new ol.Overlay({
      element: element,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -50]
    });
    map.addOverlay(popup);

    // 鼠标点击后，弹出属性提示框
    map.on("click", function(evt) {
      var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
      });
      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        $(element).popover({
          placement: "top",
          html: true,
          content: feature.get("name")
        });
        $(element).popover("show");
      } else {
        $(element).popover("destroy");
      }
    });

    // 鼠标移动后，改变鼠标样式
    map.on("pointermove", function(e) {
      if (e.dragging) {
        $(element).popover("destroy");
        return;
      }
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      map.getTarget().style.cursor = hit ? "pointer" : "";
    });
  }

  /******************************************************************************************************************
													窗口控制相关
******************************************************************************************************************/

  function showAbout() {
    document.getElementById("aboutContainer").style.visibility = "visible";
  }

  function hideAbout() {
    document.getElementById("aboutContainer").style.visibility = "hidden";
  }
});
