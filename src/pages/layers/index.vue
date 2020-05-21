<template>
  <div>
    <div id="map" ref="rootmap" style="width: 1920px;height: 830px;"></div>
    <!-- 控制层 -->
    <div style=" position: absolute; right: 10px; top: 50px;">
      <SelectMap :layers="layers" />
    </div>
    <!-- 杆塔弹出层 -->
    <div id="linepopup" class="lineol-popup">
      <a href="#" id="linepopup-closer" class="lineol-popup-closer" />
      <div id="linepopup-content" class="linepopup-content" />
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View, Feature, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import Vector from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";
import VectorSource from "ol/source/Vector";
import ImageWMS from "ol/source/ImageWMS";
import { Projection, fromLonLat, transform, get } from "ol/proj";
import Zoom from "ol/control/Zoom";
import Circle from "ol/geom/Circle";
import { Style, Fill, Stroke, Icon } from "ol/style";
import { Point, Polygon, LineString } from "ol/geom";

import SelectMap from "../../components/selectmap";

import "./index.css";

export default {
  name: "LinePoint",
  data() {
    return {
      map: null,
      layers: {}
    };
  },
  components: { SelectMap },
  mounted() {
    let mapcontainer = this.$refs.rootmap;
    let coordinates = [
      [111.560502648354, 22.760694315193],
      [111.560963988304, 22.760857555675],
      [111.561462879181, 22.761124676043],
      [111.561795473099, 22.761332435968],
      [111.561940312386, 22.761861727681],
      [111.562074422836, 22.762247565207],
      [111.562229990959, 22.762668027937],
      [111.56241774559, 22.763088489372],
      [111.562541127205, 22.763405071245],
      [111.56339943409, 22.763113222357],
      [111.563935875893, 22.762925251557],
      [111.564837098122, 22.763098382567],
      [111.56636595726, 22.762759923935],
      [111.56601190567, 22.762153579244]
    ];

    let wmsLayer = new TileLayer({
      source: new TileWMS({
        url: "http://121.37.230.82:8080/geoserver/yunfu/wms",
        params: {
          FORMAT: "image/png",
          LAYERS: "yunfu:luochen",
          TILED: true
        },
        transition: 0
      })
    });

    let view = new View({
      center: [111.563372612, 22.76211895282],
      zoom: 18,
      minZoom: 17,
      maxZoom: 18,
      projection: "EPSG:4326"
    });

    let zoom = new Zoom();
    let map = new Map({
      target: "map",
      controls: [zoom],
      view: view,
      layers: [wmsLayer]
    });
    // 添加管网线路的方法调用和图层添加
    let line = this.drawLine(coordinates);
    map.addLayer(line);
    // 添加设备的方法调用和图层添加
    let point = this.drawPoint(coordinates);
    map.addLayer(point);

    // 获取地图图层
    map
      .getLayers()
      .getArray()
      .forEach(layer => {
        if (layer.get("type") !== undefined) {
          if (layer.get("type") === "pipenetwork") {
            this.layers.pipenetwork = [
              {
                type: "pipenetwork",
                title: layer.get("title")
              }
            ];
          }
          if (layer.get("type") === "equipment") {
            this.layers.equipment = [
              { type: "equipment", title: layer.get("title") }
            ];
          }
        }
      });

    // 鼠标over时，鼠标手势为pointer
    map.on("pointermove", function(e) {
      let pixel = map.getEventPixel(e.originalEvent);
      let feature = map.forEachFeatureAtPixel(pixel, feature => {
        return feature;
      });
      if (feature != undefined) {
        map.getTargetElement().style.cursor = "pointer";
      } else {
        map.getTargetElement().style.cursor = "auto";
      }
    });

    // 添加设备的弹出层
    let linepopup = document.getElementById("linepopup");
    let linepopupContent = document.getElementById("linepopup-content");
    let linepopupCloser = document.getElementById("linepopup-closer");
    let overlay = new Overlay({
      //设置弹出框的容器
      element: linepopup,
      //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
      autoPan: true
    });
    // 点击其他地方时，弹窗关闭
    linepopupCloser.addEventListener("click", () => {
      overlay.setPosition(undefined);
    });
    // 弹出出发事件===>地图点击事件，筛选出设备
    map.on("click", e => {
      let pixel = map.getEventPixel(e.originalEvent);
      let coodinate = e.coordinate;
      map.forEachFeatureAtPixel(pixel, feature => {
        let type = feature.get("type");
        if (type === "point") {
          linepopupContent.style.display = "block";
          //设置弹出框内容，可以HTML自定义
          linepopupContent.innerHTML = `1234879`;
          //设置overlay的显示位置
          overlay.setPosition(coodinate);
          //显示overlay
          map.addOverlay(overlay);
          return;
        }
      });
    });
  },
  methods: {
    // 绘制线端函数
    drawLine(coordinates) {
      let vectorSource = new VectorSource();
      let vectorLayer = new Vector({
        type: "pipenetwork",
        title: "管线",
        source: vectorSource,
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.1)"
          }),
          stroke: new Stroke({
            color: "blue",
            width: 5
          })
        })
      });
      let plygon = new LineString(coordinates, "XY");
      let feature = new Feature({
        geometry: plygon
      });
      vectorSource.addFeature(feature);
      return vectorLayer;
    },
    //绘制点函数
    drawPoint(coordinates) {
      let vectorSource = new VectorSource({});
      coordinates.forEach(element => {
        let iconFeature = new Feature({
          geometry: new Point(element)
        });
        iconFeature.set("type", "point");
        let iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: "https://openlayers.org/en/v4.6.5/examples/data/icon.png"
          })
        });
        iconFeature.setStyle(iconStyle);
        vectorSource.addFeature(iconFeature);
      });
      let vectorLayer = new Vector({
        type: "equipment",
        title: "阀门",
        source: vectorSource
      });
      return vectorLayer;
    }
  }
};
</script>

<style>
.ol-control {
  background-color: rgba(255, 255, 255, 0) !important;
}
.ol-control:hover {
  background-color: rgba(255, 255, 255, 0) !important;
}
.ol-zoom-in {
  width: 32px !important;
  height: 32px !important;
  border-radius: 16px !important;
  background-color: #666666 !important;
  color: #fbfe00 !important;
}
.ol-zoom-in:hover {
  width: 32px !important;
  height: 32px !important;
  border-radius: 16px !important;
  background-color: rgb(179, 151, 142) !important;
  color: #7309aa !important;
}

.ol-zoom-out {
  width: 32px !important;
  height: 32px !important;
  border-radius: 16px !important;
  background-color: #666666 !important;
  color: #fbfe00 !important;
}
.ol-zoom-out:hover {
  width: 32px !important;
  height: 32px !important;
  border-radius: 16px !important;
  background-color: rgb(179, 151, 142) !important;
  color: #7309aa !important;
}

.ol-zoomslider {
  top: 6em !important;
  left: 20px !important;
  background-color: rgba(255, 69, 0, 0.2) !important;
  width: 15px !important;
  height: 200px !important;
  padding: 0 !important;
  box-shadow: 0 0 5px #00b271 !important;
  border-radius: 20px !important;
}

.ol-zoomslider-thumb {
  height: 20px !important;
  width: 15px !important;
  margin: 0 !important;
  filter: none !important;
  background-color: rgba(255, 69, 0, 0.6) !important;
  border-radius: 5px !important;
}
</style>