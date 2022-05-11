<template>
  <div class='exploration-unit'>
    <Unity class="unity" :canvasWidth="toWidth(0.95)" :canvasHeight="toHeight(0.95)"></Unity>
    <div class="batch-filter cell">
      <BatchFilter></BatchFilter>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex"
import global from "@/constants/global"

import Unity from "@/components/Unity.vue"
import BatchFilter from "@/components/BatchFilter"

const baseSize = 16

export default {
  name: "Exploration-Unit",
  data() {
    return {
      renderComponent: true,
      curSelect: null,
    }
  },
  computed: {
    ...mapState(['rem']),
  },
  components: {
    Unity,
    BatchFilter,
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

.unity {
  background-color: rgba(238, 221, 142, 0.651);
  top: 5vh;
  left: 5vw;
  right: 5vw;
  // width: 80vw;
  height: 80vh;
}

.batch-filter {
  right: 40vw;
  // top: $gap + 5vh;
  bottom: 10vh;
  height: 5vh;
  width: 15vw;
}
</style>
