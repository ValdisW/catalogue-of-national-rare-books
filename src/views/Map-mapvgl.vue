<template>
  <div class="spatial-sampling">
    <div class="section-name">
      <span></span>
      <span>全部古籍館藏地理分佈</span>
      <span></span>
    </div>

    <!-- 左侧地图 -->
    <div id="map-container" @wheel.stop=""></div>
    <!-- 右侧列表 -->
    <div id="map-list">
      <!-- 省份列表 -->
      <ul class="provinces">
        <li
          v-for="(city, index) in province_info"
          :key="index"
          @click.self="expandProvince(city)"
          :id="`list-${index}`"
          :show="false"
        >
          <span
            v-text="`${city.name} - ${city.count}`"
            @click.self="expandProvince(city)"
          ></span>
          <!-- 机构列表 -->
          <ul class="institutions" v-show="city.selected">
            <li
              v-for="e in city.child"
              :key="e"
              @click="
                flyToInstitution(
                  this.$store.state.all_institution.find((el) => el.id == e)
                )
              "
              v-text="
                this.$store.state.all_institution.find((el) => el.id == e)
                  .name +
                ' - ' +
                this.$store.state.all_institution.find((el) => el.id == e).books
              "
            ></li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- 悬浮框 -->
    <div id="tooltip">
      <div id="tooltip-box">
        <h2 v-text="current_institution_name"></h2>
        <div class="intro" v-text="current_institution_intro"></div>
        <div class="books" v-text="current_institution_books"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current_institution_name: "",
      current_institution_intro: "",
      current_institution_books: "",
      zoom: null,
      pointLayer: null,
      province_info: [
        {
          name: null,
          count: null,
          child: [],
          pos: null,
          selected: false,
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
    // 显示省份点
    drawProvinceMap() {
      this.pointLayer = this.provinceLayer;
      this.view.removeLayer(this.institutionLayer);
      this.view.addLayer(this.provinceLayer);
    },
    // 显示机构点
    drawInstitutionMap() {
      this.pointLayer = this.institutionLayer;
      this.view.removeLayer(this.provinceLayer);
      this.view.addLayer(this.institutionLayer);
    },
    initProvinceLayer() {
      let data = [];
      this.province_info = [];

      for (let city of this.$store.state.all_province) {
        data.push({
          geometry: {
            type: "Point",
            coordinates: [city["lng"], city["lat"]],
          },
          properties: {
            id: city["id"],
            count: city["books"],
            name: city["name"],
          },
        });

        this.province_info.push({
          name: city["name"],
          count: city["books"],
          child: city["child"],
          pos: { lng: city["lng"], lat: city["lat"] },
          selected: false,
        });
      }

      /* eslint-disable */
      var intensity = new mapvgl.Intensity({
        max: 3081,
        min: 0,
        gradient: {
          0: "rgba(106, 50, 63, 0.7)",
        },
        maxSize: this.zoom * 6,
        minSize: this.zoom * 2,
      });

      /* eslint-disable */
      this.provinceLayer = new mapvgl.PointLayer({
        // blend: 'lighter',
        size: (data) => intensity.getSize(data.properties.count),
        color: (data) => intensity.getColor(data.properties.count),
        enablePicked: true,
        selectedColor: "#ff000088",
        autoSelect: true,
        onClick: (e) => {
          // 点击事件
          let id = e.dataIndex;
          if (id == -1) this.map.reset();
          else this.expandProvince(this.province_info[id]);
        },
      });

      this.provinceLayer.setData(data);
    },
    initInstitutionLayer() {
      let data = [];
      let institution_list = this.$store.state.all_institution; // 机构id数组

      for (let inst of institution_list) {
        data.push({
          geometry: {
            type: "Point",
            coordinates: [inst["lng"], inst["lat"]],
          },
          properties: {
            id: inst["id"],
            count: inst.books,
            name: inst["name"],
          },
        });
      }

      /* eslint-disable */
      let intensity = new mapvgl.Intensity({
        max: 3081,
        min: 0,
        gradient: {
          0: "rgba(106, 50, 63, 0.7)",
          // 0.3: "rgb(145, 102, 129)",
          // 0.7: "rgb(210, 131, 137)",
          // 1: "rgb(248, 177, 149)",
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
        selectedColor: "#ff000088",
        autoSelect: true,
        onClick: (e) => {
          // 点击机构点
          let id = e.dataIndex;
          if (id == -1) {
            this.map.reset();
            this.removeAllSublist();
          }
        },
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
      let map = new BMapGL.Map("map-container", {
        restrictCenter: false,
        // style: {styleJson: options.style || darkStyle }
      });
      map.enableKeyboard();
      map.enableScrollWheelZoom();
      map.enableInertialDragging();
      map.enableContinuousZoom();
      map.setDefaultCursor("default");

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
          self.removeTooltip();
          return;
        }
        self.showTooltip(e, index.dataItem.properties);
      });
      return map;
    },
    showTooltip(e, d) {
      // position
      let left = e.x;
      let top = e.y;

      // 保证 Tooltip 提示框不会超出浏览器的窗口
      if (left + this.tooltipBox.offsetWidth > document.body.clientWidth) {
        let demoLeft = document.getElementById("map-container").offsetLeft;
        left = document.body.clientWidth - toolTipBox.offsetWidth - demoLeft;
        if (left < 0) left = 0;
      }
      this.tooltipBox.style.left = left + "px";
      this.tooltipBox.style.top = top + 20 + "px";
      // text
      this.current_institution_name = d.name;
      this.current_institution_intro = this.$store.state.all_institution.find((el) => el.id == d.id)
        ? this.$store.state.all_institution.find((el) => el.id == d.id).intro
        : "";
      this.current_institution_books = `入选古籍数: ${d.count}`;

      this.tooltipBox.style.visibility = "visible";
    },
    removeTooltip() {
      this.tooltipBox.style.visibility = "hidden";
    },
    // 点击省份列表的省份项
    expandProvince(d) {
      if (d.selected) {
        this.map.reset();
        d.selected = false;
      } else {
        this.zoom = 7;
        this.map.flyTo(d.pos, 7);
        this.province_info.forEach((el) => (el.selected = false));
        d.selected = true;
      }
    },
    flyToInstitution(e) {
      this.zoom = 10;
      this.map.flyTo({ lat: e.lat, lng: e.lng }, this.zoom);
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
    // 初始化地图参数
    this.zoom = 5;
    this.map = this.initMap({
      tilt: 0,
      heading: 0,
      center: [104.438656, 37.753594],
      zoom: this.zoom,
    });
    /* eslint-disable */
    this.view = new mapvgl.View({
      map: this.map,
    });

    this.tooltipBox = document.getElementById("tooltip-box");
    this.initProvinceLayer();
    this.initInstitutionLayer();
  },
};
</script>

<style lang="less">
.spatial-sampling {
  display: flex;
  align-items: center;
  position: absolute;
  top: 10vh;
  left: 5vw;
  width: 90vw;
  height: 80vh;

  #map-container {
    // position: fixed;
    width: 80%;
    height: 100%;
    border: 2px solid #201d1d;
  }

  #tooltip {
    #tooltip-box {
      background-color: #333;
      z-index: 10;
      padding: 0.6rem;
      font-size: 0.8rem;
      width: auto;
      height: auto;
      position: absolute;
      display: block;
      visibility: hidden;
      max-width: 33%;
      color: #efefef;
      h2 {
        font-size: 1rem;
        color: #efefef;
      }
      .intro {
        font-size: 0.7rem;
      }
    }
  }

  #map-list {
    border: 2px solid #201d1d;
    border-left: none;
    width: 20%;
    top: 0%;
    right: 0%;
    height: 100%;
    cursor: pointer;
    overflow-y: scroll;
    font-size: 0.7rem;
    text-align: left;

    ul.provinces {
      li {
        // background: rgb(255, 255, 255);
        padding: 0.3rem 0 0.3rem 0.3rem;
        ul.institutions {
          padding: 0.5rem 0 0;
          font-size: 0.6rem;
          li {
            padding: 0.2rem 0 0.2rem 0.6rem;
            // color:  rgba(106, 50, 63, 0.7);
          }
        }
      }
    }
  }
}
.anchorBL {
  filter: saturate(0.7);
}
</style>
