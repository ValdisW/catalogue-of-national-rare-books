
<template>
  <div class='exploration-stream'>
    <StreamGraph class="streamgraph" :canvasWidth="toWidth(1)" :canvasHeight="toHeight(0.8)"></StreamGraph>
  </div>
</template>

<script>
import {mapState} from "vuex"
import global from "@/constants/global"

import StreamGraph from "@/components/StreamGraph.vue"

const baseSize = 16

export default {
  name: "Exploration-Stream",
  data() {

  },
  computed: {
    ...mapState(['rem']),
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
    setRem() {   
      // 用于根据页面大小设定rem，以自适应元素大小
      let self =this
      const scale = global.PageSize().width / 1280   
      let rem = (baseSize * Math.min(scale, 50))
      self.$store.commit("changeRem", rem)
      document.documentElement.style.fontSize = rem + 'px' 
    },
    init(){
      let self = this;
      self.setRem()
      window.onresize = function () { 
        self.init();
      }
    }
  },
  created() {
  },
  mounted() {
    let self = this
    self.init()
  }
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
