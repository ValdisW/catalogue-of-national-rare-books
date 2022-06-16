<template>
  <div class="spatialSampling">
    <div id="map_container"></div>
    <div id="map-list">
      <ul>
        <li v-for="(city, index) in province_info" :key="index" :id="`list-${index}`" :show="false">
          <p @click="clickProvince(city, index)">{{ city.name }} - {{ city.count }}</p>
        </li>
      </ul>
    </div>
    <div id="tooltip">
      <div id="tooltip-box"></div>
    </div>
  </div>
</template>

<script>
import * as Data from "@/data/dataLoader";

export default {
  data() {
    return {
      zoom: null,
      pointLayer: null,
      province_info: [
        {
          name: null,
          count: null,
          child: [],
          pos: null,
        },
      ],
      insititution_info: {
        id: {
          name: null,
          count: null,
          pos: null,
        },
      },
    };
  },
  watch: {
    zoom: function (val) {
      if (val > 6) this.drawInstitutionMap();
      else this.drawProvinceMap();
    },
  },
  methods: {
    drawProvinceMap() {
      this.pointLayer = this.provinceLayer;
      this.view.removeLayer(this.institutionLayer);
      this.view.addLayer(this.provinceLayer);
    },
    drawInstitutionMap() {
      this.pointLayer = this.institutionLayer;
      this.view.removeLayer(this.provinceLayer);
      this.view.addLayer(this.institutionLayer);
    },
    initProvinceLayer() {
      var data = [];
      var province_info = Data.get_province_list();

      this.province_info = [];

      for (let i in province_info) {
        let city = province_info[i];
        data.push({
          geometry: {
            type: "Point",
            coordinates: [city["经度"], city["纬度"]],
          },
          properties: {
            count: city["藏书总数"],
            name: city["省份"],
          },
        });

        this.province_info.push({
          name: city["省份"],
          count: city["藏书总数"],
          child: city["馆藏ID"],
          pos: { lng: city["经度"], lat: city["纬度"] },
        });
      }

      /* eslint-disable */
      var intensity = new mapvgl.Intensity({
        max: 3081,
        min: 0,
        gradient: {
          0: "rgb(25, 66, 102, 0.8)",
          0.3: "rgb(145, 102, 129, 0.8)",
          0.7: "rgb(210, 131, 137, 0.8)",
          1: "rgb(248, 177, 149, 0.8)",
        },
        maxSize: this.zoom * 6,
        minSize: this.zoom * 2,
      });

      /* eslint-disable */
      this.provinceLayer = new mapvgl.PointLayer({
        // blend: 'lighter',
        size: function (data) {
          return intensity.getSize(data.properties.count);
        },
        color: function (data) {
          return intensity.getColor(data.properties.count);
        },
        enablePicked: true,
        selectedColor: "#ff0000",
        autoSelect: true,
        onClick: (e) => {
          // 点击事件
          let id = e.dataIndex;
          if (id == -1) this.map.reset();
          else this.clickProvince(this.province_info[id], id);
        },
        onMousemove: (e) => {
          console.log("hover", e);
        },
      });

      this.provinceLayer.setData(data);
    },
    initInstitutionLayer() {
      var data = [];
      var institution_list = Data.get_institution_list();

      this.insititution_info = [];

      for (let i in institution_list) {
        let inst = Data.get_institution_info(institution_list[i]);
        data.push({
          geometry: {
            type: "Point",
            coordinates: [inst["经度"], inst["纬度"]],
          },
          properties: {
            count: inst.cnt,
            name: inst["馆名"],
          },
        });

        this.insititution_info[institution_list[i]] = {
          count: inst.cnt,
          name: inst["馆名"],
          pos: { lng: inst["经度"], lat: inst["纬度"] },
        };
      }

      /* eslint-disable */
      var intensity = new mapvgl.Intensity({
        max: 3081,
        min: 0,
        gradient: {
          0: "rgb(25, 66, 102, 0.8)",
          0.3: "rgb(145, 102, 129, 0.8)",
          0.7: "rgb(210, 131, 137, 0.8)",
          1: "rgb(248, 177, 149, 0.8)",
        },
        maxSize: this.zoom * 6,
        minSize: this.zoom * 1.5,
      });

      /* eslint-disable */
      this.institutionLayer = new mapvgl.PointLayer({
        // blend: 'lighter',
        size: (data) => intensity.getSize(data.properties.count),
        color: (data) => intensity.getColor(data.properties.count),
        enablePicked: true,
        selectedColor: "#ff0000",
        autoSelect: true,
        onClick: (e) => {
          // 点击事件
          this.$router.push(`/institution-detail/${e.dataItem.properties.name}`);
          let id = e.dataIndex;
          if (id == -1) {
            this.map.reset();
            this.removeAllSublist();
          } else {
            // this.clickProvince(this.province_info[id], id)
          }
        },
        // onMousemove: (e) => {
        //   console.log(e);
        // },
      });

      this.institutionLayer.setData(data);
    },
    initMap(options) {
      let self = this;
      options = Object.assign(
        {
          tilt: 60,
          heading: 0,
        },
        options
      );
      /* eslint-disable */
      let map = new BMapGL.Map("map_container", {
        restrictCenter: false,
        // style: {styleJson: options.style || darkStyle }
      });
      map.enableKeyboard();
      map.enableScrollWheelZoom();
      map.enableInertialDragging();
      map.enableContinuousZoom();

      // map.setDisplayOptions(options.displayOptions || {
      //         indoor: false,
      //         poi: true,
      //         skyColors: options.skyColors || [
      //             'rgba(5, 5, 30, 0.01)',
      //             'rgba(5, 5, 30, 1.0)'
      //         ]
      //     });
      if (options.center && options.zoom) {
        let center = options.center;
        if (center instanceof Array) {
          center = new BMapGL.Point(options.center[0], options.center[1]);
        }
        map.centerAndZoom(center, options.zoom);
      }

      map.setTilt(options.tilt);
      map.setHeading(options.heading);

      map.setMapStyleV2({
        styleId: "89e1e7d01eec9442b2747defbdcddb8b",
      });

      map.on("zoomend", function (e) {
        self.zoom = e.target.zoomLevel;
      });
      map.addEventListener("mousemove", function (e) {
        if (self.pointLayer == null) return;
        let index = self.pointLayer.pick(e.x, e.y);
        if (index.dataIndex == -1) {
          // move tooltip
          self.removeTooltip();
          return;
        }
        self.showTooltip(e, index.dataItem.properties);
      });
      console.log(map);
      return map;
    },
    initTooltip() {
      this.tooltipBox = document.getElementById("tooltip-box");
      console.log(this.tooltipBox);
      // let tooltip = document.getElementById("tooltip")
      // let toolTipBox = document.createElement("div")
      // toolTipBox.className = "tooltip-box"
      // tooltip.appendChild(toolTipBox)
    },
    showTooltip(e, d) {
      // position
      let left = e.x;
      let top = e.y;

      // 保证 Tooltip 提示框不会超出浏览器的窗口
      if (left + this.tooltipBox.offsetWidth > document.body.clientWidth) {
        let demoLeft = document.getElementById("map_container").offsetLeft;
        left = document.body.clientWidth - toolTipBox.offsetWidth - demoLeft;
        if (left < 0) {
          left = 0;
        }
      }
      this.tooltipBox.style.left = left + "px";
      this.tooltipBox.style.top = top + 20 + "px";

      // text
      let html = `<p>${d.name}<br/>藏书数: ${d.count}</p>`;
      this.tooltipBox.innerHTML = html;

      this.tooltipBox.style.visibility = "visible";
    },
    removeTooltip() {
      this.tooltipBox.style.visibility = "hidden";
    },
    clickProvince(d, i) {
      let list = document.getElementById("list-" + i);
      if (list.getAttribute("show") == "false") {
        // draw
        this.removeAllSublist();
        this.showSublist(d, list);
      } else {
        // remove
        list.removeChild(list.children[1]);
        list.setAttribute("show", false);
        this.map.reset();
      }
    },
    showSublist(d, list) {
      let sublist = document.createElement("ul");
      let self = this;
      sublist.setAttribute("id", "sublist");
      for (let i in d.child) {
        let child_id = d.child[i];
        let child = this.insititution_info[child_id];
        if (child == undefined) {
          console.log(child_id);
          continue;
        }
        let li = document.createElement("li");
        li.innerHTML = `${child.name} - ${child.count}`;
        li.onclick = function () {
          self.zoom = 10;
          self.map.flyTo(child.pos, 10);
        };
        sublist.appendChild(li);
      }
      list.appendChild(sublist);
      list.setAttribute("show", true);

      // zoom in and center
      this.zoom = 7;
      this.map.flyTo(d.pos, 7);
    },
    removeAllSublist() {
      for (let i in this.province_info) {
        let list = document.getElementById("list-" + i);
        if (list.getAttribute("show") == "true") {
          list.removeChild(list.children[1]);
          list.setAttribute("show", false);
        }
      }
    },
  },
  mounted() {
    this.zoom = 5;
    this.map = this.initMap({
      tilt: 49.6,
      heading: 0,
      center: [103.438656, 25.753594],
      zoom: this.zoom,
    });
    /* eslint-disable */
    this.view = new mapvgl.View({
      map: this.map,
    });

    this.initTooltip();
    this.initProvinceLayer();
    this.initInstitutionLayer();
  },
  computed: {},
};
</script>

<style lang="less">
.spatialSampling {
  display: flex;
  position: absolute;
  top: 10vh;
  left: 5vw;
  width: 90vw;
  height: 80vh;
  #map_container {
    // position: fixed;
    width: 80%;
    height: 100%;
    border: 2px solid rgb(177, 117, 68);
  }
  #tooltip {
    #tooltip-box {
      background-color: #333;
      color: #fff;
      padding: 0.6rem;
      font-size: 0.8rem;
      width: auto;
      height: auto;
      position: absolute;
      display: block;
      visibility: hidden;
    }
  }
  #map-list {
    // position: absolute;
    width: 20%;
    top: 0%;
    right: 0%;
    height: 100%;
    cursor: pointer;
    overflow-y: scroll;
    font-size: 0.7rem;
    text-align: center;
    ul {
      li {
        padding: 0.3rem 0;
      }
    }
    #sublist {
      background-color: antiquewhite;
      // overflow: scroll;
    }
  }
}
</style>
