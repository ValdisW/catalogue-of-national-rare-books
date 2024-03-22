<script lang="ts" setup>
import { inject, ref, watch } from "vue";
import { Intensity, PointLayer, View } from "mapvgl";
import { BaiduMap } from "vue-baidu-map-3x";

// import { mapState } from "vuex";

const all_province = inject("introductionData").value[6];
const all_institution = inject("introductionData").value[7];

// const rem = computed(() => {
//   return mapState(["rem"]).rem;
// });

interface province {
  name: string;
  count: number;
  child: number[];
  pos: { lng: number; lat: number };
  selected: boolean;
}

interface institution {
  books: number;
  id: number;
  intro: string;
  lat: number;
  lng: number;
  name: string;
  province_id: string;
}

const mapInstance = ref(null);
const current_institution_name = ref("");
const current_institution_intro = ref("");
const current_institution_books = ref("");
const zoom = ref(null);
const pointLayer = ref();
const institutionLayer = ref<PointLayer>();
const provinceLayer = ref();
// const tooltipBox = ref<HTMLElement | null>();
const ToolTipBoxRef = ref(null);
const province_info = ref<province[]>([]); // 用来控制右侧省份列表的内容
// const insititution_info = ref({
//   id: {
//     name: null,
//     count: null,
//     pos: null,
//   },
// });
const view = ref<View>(null);

watch(zoom, (val) => {
  if (val > 6) drawInstitutionMap();
  else drawProvinceMap();
});

// 显示省份点
function drawProvinceMap() {
  pointLayer.value = provinceLayer.value;
  view.value.removeLayer(institutionLayer.value);
  view.value.addLayer(provinceLayer.value);
}

// 显示机构点
function drawInstitutionMap() {
  pointLayer.value = institutionLayer.value;
  view.value.removeLayer(provinceLayer.value);
  view.value.addLayer(institutionLayer.value);
}

function showTooltip(e: MouseEvent, d: { id: string; count: number; name: string }) {
  // position
  let left = e.x;
  let top = e.y;

  // 保证 Tooltip 提示框不会超出浏览器的窗口
  if (left + ToolTipBoxRef.value.offsetWidth > document.body.clientWidth) {
    let demoLeft = document.getElementById("map-container")?.offsetLeft;
    left = document.body.clientWidth - ToolTipBoxRef.value.offsetWidth - demoLeft;
    if (left < 0) left = 0;
  }
  ToolTipBoxRef.value.style.left = left + "px";
  ToolTipBoxRef.value.style.top = top + 20 + "px";
  // text
  current_institution_name.value = d.name;
  current_institution_intro.value = all_institution.find((el) => el.id == d.id)
    ? all_institution.find((el) => el.id == d.id).intro
    : "";
  current_institution_books.value = `入選古籍數: ${d.count}`;

  ToolTipBoxRef.value.style.visibility = "visible";
}

function removeTooltip() {
  ToolTipBoxRef.value.style.visibility = "hidden";
}

// 点击省份列表的省份项
function expandProvince(d: province) {
  if (d.selected) mapInstance.value.reset();
  else {
    mapInstance.value.flyTo(d.pos, (zoom.value = 7));
    province_info.value.forEach((el) => (el.selected = false)); // 折叠全部省份
  }
  d.selected = !d.selected;
}

// 点击列表中的机构项
function flyToInstitution(e: institution) {
  mapInstance.value.flyTo({ lat: e.lat, lng: e.lng }, (zoom.value = 10));
}

function removeAllSublist() {
  for (let i in province_info.value) {
    let list = document.getElementById("list-" + i);
    if (list && list.getAttribute("show") == "true") {
      list.removeChild(list.children[1]);
      list.setAttribute("show", "false");
    }
  }
}

// 设置省份点的属性
function initProvinceLayer() {
  let data = []; // 省份点的几何数据
  province_info.value = []; // 省份列表的数据

  for (let city of all_province) {
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

    province_info.value.push({
      name: city["name"],
      count: city["books"],
      child: city["child"],
      pos: { lng: city["lng"], lat: city["lat"] },
      selected: false,
    });
  }

  let intensity = new Intensity({
    max: 3081,
    min: 0,
    gradient: {
      0: "rgba(106, 50, 63, 0.7)", // 可以使用渐变色，这里暂时只用一种颜色
      // 0.3: "rgb(145, 102, 129)",
      // 0.7: "rgb(210, 131, 137)",
      // 1: "rgb(248, 177, 149)",
    },
    maxSize: zoom.value * 6,
    minSize: zoom.value * 2,
  });

  provinceLayer.value = new PointLayer({
    // blend: 'lighter',
    size: (data) => intensity.getSize(data.properties.count),
    color: (data) => intensity.getColor(data.properties.count),
    enablePicked: true,
    selectedColor: "#ff000088",
    autoSelect: true,
    onClick: (e: PointerEvent) => {
      // 点击事件
      let id = e.dataIndex;
      if (id == -1) mapInstance.value.reset();
      else expandProvince(province_info.value[id]);
    },
  });

  provinceLayer.value.setData(data);
}

// 设置机构点的属性
function initInstitutionLayer() {
  let data = [];
  let institution_list = all_institution; // 机构id数组

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

  let intensity = new Intensity({
    max: 3081,
    min: 0,
    gradient: {
      0: "rgba(106, 50, 63, 0.7)",
      // 0.3: "rgb(145, 102, 129)",
      // 0.7: "rgb(210, 131, 137)",
      // 1: "rgb(248, 177, 149)",
    },
    maxSize: zoom.value * 6,
    minSize: zoom.value * 1.5,
  });

  institutionLayer.value = new PointLayer({
    // blend: 'lighter',
    size: (data) => intensity.getSize(data.properties.count),
    color: (data) => intensity.getColor(data.properties.count),
    enablePicked: true,
    selectedColor: "#ff000088",
    autoSelect: true,
    onClick: (e: PointerEvent) => {
      // 点击机构点
      let id = e.dataIndex;
      if (id == -1) {
        mapInstance.value.reset();
        removeAllSublist();
      }
    },
  });

  institutionLayer.value.setData(data);
}

function initMap(
  BMap,
  options: { tilt: number; heading: number; center: [number, number]; zoom: number; [n: string]: any }
) {
  options = Object.assign(
    {
      tilt: 60,
      heading: 0,
    },
    options
  );
  // let map = new BMapGL.Map("map-container", {
  //   restrictCenter: false,
  //   // style: {styleJson: options.style || darkStyle }
  // });
  mapInstance.value.enableKeyboard();
  mapInstance.value.enableScrollWheelZoom();
  mapInstance.value.enableInertialDragging();
  mapInstance.value.enableContinuousZoom();
  mapInstance.value.setDefaultCursor("default");

  if (options.center && options.zoom) {
    let center = options.center;
    if (center instanceof Array) center = new BMap.Point(options.center[0], options.center[1]);
    mapInstance.value.centerAndZoom(center, options.zoom);
  }

  mapInstance.value.setTilt(options.tilt);
  mapInstance.value.setHeading(options.heading);

  mapInstance.value.setMapStyleV2({ styleId: "89e1e7d01eec9442b2747defbdcddb8b" });

  mapInstance.value.on("zoomend", function (e) {
    zoom.value = e.target.zoomLevel;
  });
  mapInstance.value.addEventListener("mousemove", function (e: MouseEvent) {
    if (pointLayer.value == null) return;
    let index = pointLayer.value.pick(e.x, e.y);
    if (index.dataIndex == -1) {
      removeTooltip();
      return;
    }
    showTooltip(e, index.dataItem.properties);
  });
  mapInstance.value.addEventListener("click", function (e: MouseEvent) {
    e.preventDefault();
  });

  mapInstance.value.disableScrollWheelZoom();
  mapInstance.value.disableDoubleClickZoom();
}

const mapReady = ({ BMap, map }) => {
  mapInstance.value = map;
  zoom.value = 5;
  // 初始化地图参数
  initMap(BMap, {
    tilt: 0,
    heading: 0,
    center: [104.438656, 37.753594],
    zoom: zoom.value,
  });
  view.value = new View({
    map: mapInstance.value,
  });

  // tooltipBox.value = document.getElementById("tooltip-box");
  initProvinceLayer();
  initInstitutionLayer();
};
</script>

<template>
  <div class="exploration-map">
    <!-- <Map class="baidumap"></Map> -->
    <div class="spatial-sampling">
      <div class="section-name">
        <span></span>
        <span>入選名録古籍藏地分布</span>
        <span></span>
        <span></span>
      </div>

      <!-- 左侧地图 -->
      <div id="map-container" @wheel.stop="">
        <baidu-map
          class="map"
          ak="1rhcTPAuchh7EM6ovKAw84oGUmAElH70"
          v="3.0"
          type="WebGL"
          :center="{ lng: 104.438656, lat: 37.753594 }"
          :zoom="5"
          @ready="mapReady"
        >
        </baidu-map>
      </div>

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
            <span v-text="`${city.name} - ${city.count}`" @click.self="expandProvince(city)"></span>
            <!-- 机构列表 -->
            <ul class="institutions" v-show="city.selected">
              <li
                v-for="e in city.child"
                :key="e"
                @click="flyToInstitution(all_institution.find((el) => el.id == e))"
                v-text="
                  all_institution.find((el) => el.id == e).name + ' - ' + all_institution.find((el) => el.id == e).books
                "
              ></li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- 悬浮框 -->
      <div id="tooltip">
        <div ref="ToolTipBoxRef" id="tooltip-box">
          <h2 v-text="current_institution_name"></h2>
          <div class="intro" v-text="current_institution_intro"></div>
          <div class="books" v-text="current_institution_books"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.exploration-map {
  width: 100vw;
  height: 100vh;
  position: relative;
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
      .map {
        height: 100%;
      }
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
          margin: 0.1rem 0 0.1rem;
        }
        .books {
          font-size: 0.7rem;
          color: #bbb;
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
}

.anchorBL {
  filter: saturate(0.7);
}
</style>
