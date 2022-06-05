
<template>
  <div class='exploration-flow'>
    <ScrollBar class="scroll-bar" 
              :canvasWidth="toWidth(0.5)" 
              :canvasHeight="toHeight(0.1)"
              v-on:changeRate="updateRate">
    </ScrollBar>
    <Flow class="flow" 
          :rate="rate"
          :canvasWidth="toWidth(1)" 
          :canvasHeight="toHeight(0.8)">
    </Flow>
  </div>
</template>

<script>
import {mapState} from "vuex"
import global from "@/constants/global"

import Flow from "@/components/FlowingParticles2.vue"
import ScrollBar from "@/components/ScrollBar.vue"

const baseSize = 16

export default {
  name: "Exploration-Flow",
  data() {
    return {
      rate: null,
    }
  },
  computed: {
    ...mapState(['rem']),
  },
  components: {
    Flow,
    ScrollBar,
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
    },
    updateRate(rate) {
      this.rate = rate
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

.exploration-flow {
    background-color: rgba(238, 221, 142, 0.651);
    width: 100vw;
    height: 100vh;
    .flow {
      // position: fixed;
      // top: 30vh;
      width: 100vw;
      height: 60vh;
    }
    .scroll-bar {
      position: fixed;
      width: 50vw;
      left: 10vw;
      height: 10vh;
      top: 10vh;
    }
}

</style>
