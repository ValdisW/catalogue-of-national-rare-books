<template>
  <div class="exploration-map">
    <Map class="baidumap"></Map>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Map from "@/views/Map-mapvgl.vue";

export default {
  name: "Exploration-BaiduMap",
  components: {
    Map,
  },
  computed: {
    ...mapState(["rem"]),
  },
};
</script>

<style lang="less" scoped>
.exploration-map {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>
