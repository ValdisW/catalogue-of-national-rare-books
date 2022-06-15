<template>
  <div class="exploration-stream">
    <StreamGraph class="streamgraph" :canvasWidth="toWidth(1)" :canvasHeight="toHeight(0.8)"></StreamGraph>
  </div>
</template>

<script>
import { mapState } from "vuex";

import StreamGraph from "@/components/StreamGraph.vue";

export default {
  name: "Exploration-Stream",
  data() {},
  computed: {
    ...mapState(["rem"]),
  },
  components: {
    StreamGraph,
  },
  methods: {
    toWidth(p) {
      return window.innerWidth * p;
    },
    toHeight(p) {
      return window.innerHeight * p;
    },
  },
};
</script>

<style lang="less" scoped>
// .about {
//   width: 100vw;
//   height: 100vh;
//   background: linear-gradient(#b8a885, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #b8a885);
// }

.streamgraph {
  background-color: rgba(238, 221, 142, 0.651);
  width: 100vw;
  height: 100vh;
}
</style>
