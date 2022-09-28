<template>
  <div class="spatialSampling">
    <div id="map_container" @wheel.stop=""></div>
    <div id="map-list">
      <ul>
        <li
          v-for="(city, index) in province_info"
          :key="index"
          @click.stop="clickProvince($event, city, index)"
          :id="`list-${index}`"
          :show="false"
        >
          <span v-text="`${city.name} - ${city.count}`"></span>
          <ul class="sublist" v-show="false">
            <li
              v-for="e in city.child"
              :key="e"
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
        size: (data) => intensity.getSize(data.properties.count),
        color: (data) => intensity.getColor(data.properties.count),
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
      let data = [];
      let institution_list = this.$store.state.all_institution; // 机构id数组

      for (let inst of institution_list) {
        // let inst = Data.get_institution_info(institution_list[i]);
        data.push({
          geometry: {
            type: "Point",
            coordinates: [inst["lng"], inst["lat"]],
          },
          properties: {
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
          // 点击机构点
          // this.$router.push(`/institution-detail/${e.dataItem.properties.name}`); // 跳转至机构详情页
          // this.$emit("openInstituionDetail", );
          console.log(e.dataItem.properties);

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
      let map = new BMapGL.Map("map_container", {
        restrictCenter: false,
        // style: {styleJson: options.style || darkStyle }
      });
      map.enableKeyboard();
      map.enableScrollWheelZoom();
      map.enableInertialDragging();
      map.enableContinuousZoom();
      map.setDefaultCursor("default");

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
        let demoLeft = document.getElementById("map_container").offsetLeft;
        left = document.body.clientWidth - toolTipBox.offsetWidth - demoLeft;
        if (left < 0) left = 0;
      }
      this.tooltipBox.style.left = left + "px";
      this.tooltipBox.style.top = top + 20 + "px";
      // text
      this.current_institution_name = d.name;
      this.current_institution_intro =
        d.name.length > 3
          ? "国家图书馆前身是筹建于1909年9月9日的京师图书馆，1998年更名为国家图书馆。该馆收藏古籍200万册件，其中善本古籍27万册件。宋元善本、敦煌遗书、赵城金藏、永乐大典、四库全书、方志家谱等是其特色藏品，另有金石拓片、舆图、少数民族语文等特藏古籍。专用古籍书库5个，总面积8493平方米。由古籍馆全面管理，工作人员130余人，专设典藏阅览、文献保护、古籍特藏修复等机构管理、保护、修复古籍。"
          : "";
      this.current_institution_books = `入选古籍数: ${d.count}`;

      this.tooltipBox.style.visibility = "visible";
    },
    removeTooltip() {
      this.tooltipBox.style.visibility = "hidden";
    },
    // 点击省份列表的省份项
    clickProvince(e, d, i) {
      if (e.target.getAttribute("show") == "false") {
        // draw
        this.removeAllSublist();
        this.showSublist(d, e.target);
      } else {
        // remove
        e.target.removeChild(e.target.children[1]);
        e.target.setAttribute("show", false);
        this.map.reset();
      }
    },
    // 显示机构菜单
    showSublist(d, list) {
      let sublist = document.createElement("ul");
      let self = this;
      // sublist.setAttribute("id", "sublist");
      for (let i in d.child) {
        let child_id = d.child[i];
        let child = this.$store.state.all_institution.find((el) => el.id == child_id);
        if (!child) {
          console.log(child_id);
          continue;
        }
        let li = document.createElement("li");
        li.innerHTML = `${child.name} - ${child.books}`;
        li.onclick = function () {
          self.zoom = 10;
          self.map.flyTo({ lng: child["lng"], lat: child["lat"] }, 10);
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
      z-index: 10;
      color: #fff;
      padding: 0.6rem;
      font-size: 0.8rem;
      width: auto;
      height: auto;
      position: absolute;
      display: block;
      visibility: hidden;
      max-width: 33%;

      h2 {
        font-size: 1rem;
      }

      .intro {
        font-size: 0.7rem;
      }
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

    .sublist {
      background-color: rgb(102, 80, 52);
      // overflow: scroll;
    }
  }
}
</style>
