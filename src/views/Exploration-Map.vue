<template>
  <svg class="exploration-map">
    <Map :size="Mapsize"></Map>
  </svg>
</template>

<script>
import { mapState } from "vuex";
import global from "@/constants/global";

import Map from "@/components/Map.vue";

const baseSize = 16;

export default {
  name: "Exploration-Map",
  data() {
    return {
      renderComponent: true,
      curSelect: null,
      Mapsize: this.Mapsize,
    };
  },
  computed: {
    ...mapState(["rem"]),
  },
  components: {
    Map,
  },
  methods: {
    toWidth(p) {
      return window.innerWidth * p;
    },
    toHeight(p) {
      return window.innerHeight * p;
    },
    setRem() {
      // 用于根据页面大小设定rem，以自适应元素大小
      let self = this;
      const scale = global.PageSize().width / 1280;
      let rem = baseSize * Math.min(scale, 50);
      self.$store.commit("changeRem", rem);
      document.documentElement.style.fontSize = rem + "px";
    },
    init() {
      let self = this;
      self.setRem();
      window.onresize = function () {
        self.init();
      };
      self.Mapsize = {
        width: this.toWidth(0.8),
        height: this.toHeight(0.9),
      };
    },
  },
  created() {},
  mounted() {
    let self = this;
    self.init();
  },
};
</script>

<style lang="less" scoped>
.exploration-map {
  background-color: rgba(238, 221, 142, 0.651);
  top: 5vh;
  left: 5vw;
  right: 5vw;
  width: 100vw;
  height: 100vh;
}
</style>
