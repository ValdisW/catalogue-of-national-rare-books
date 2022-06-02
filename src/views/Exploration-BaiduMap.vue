
<template>
  <div class='exploration-map'>
    <Map class="baidumap" ></Map>
  </div>
</template>

<script>
import {mapState} from "vuex"
import global from "@/constants/global"

import Map from "@/components/Map-mapvgl.vue"

const baseSize = 16

export default {
  name: "Exploration-BaiduMap",
  data() {

  },
  computed: {
    ...mapState(['rem']),
  },
  components: {
    Map,
  },
  methods: {
    // toWidth(p) {
    //   return window.innerWidth * p;
    // },
    // toHeight(p) {
    //   return window.innerHeight * p;
    // },
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

.exploration-map {
    background-color: rgba(238, 221, 142, 0.651);
    width: 100vw;
    height: 100vh;
}

.baidumap {
  
  position: fixed;
  top: 10vh;
  left: 5vw;
  width: 90vw;
  height: 80vh;
}
</style>
