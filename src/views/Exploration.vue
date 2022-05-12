<template>
  <div class='exploration'>
      <Button class="view-bottom" v-on:changeView="updateView"></Button>
    <Unity class="exploration-unit" :canvasWidth="toWidth(0.85)" :canvasHeight="toHeight(0.85)" :batchTitle="batchTitle"></Unity>
    <div>
        <svg class='exploration-map'>
            <Map :size="Mapsize" :batchTitle="batchTitle"></Map>
        </svg>
    </div>
    <div class="batch-filter cell">
      <BatchFilter v-on:batchChanged="updateBatchTitle"></BatchFilter>
    </div>
  </div>
</template>

<script>
const d3 = require("d3")
import {mapState} from "vuex"
import global from "@/constants/global"
// import * as Data from "@/data/dataLoader"

import Unity from "@/components/Unity.vue"
import Map from "@/components/Map.vue"
import BatchFilter from "@/components/BatchFilter.vue"
import Button from "@/components/Button.vue"

const baseSize = 16

export default {
  name: "Exploration",
  data() {
    return {
    //   renderComponent: true,
      batchTitle: this.batchTitle,
      Mapsize: this.Mapsize,
    }
  },
  computed: {
    ...mapState(['rem']),
  },
  components: {
    Unity,
    Map,
    BatchFilter,
    Button,
  },
  watch: {
    //   batchTitle(newVal, oldVal) {
    //       this.$emit("batchChanged", newVal)
    //       console.log(newVal)
    //   }
    
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
      self.Mapsize = {
        width : this.toWidth(0.85),
        height : this.toHeight(0.85),
      }
      self.view = "unit"
        self.batchTitle = '第1批'
        console.log("rem",this.rem)
    },
    updateBatchTitle(e) {
        this.batchTitle = e;
    },
    updateView(v) {
        this.view = v
        if (v=="unit") {
            d3.select(".exploration-map").style("visibility", "hidden");
            d3.select(".exploration-unit").style("visibility", "visible");
        }
        if (v=="map") {
            d3.select(".exploration-unit").style("visibility", "hidden");
            d3.select(".exploration-map").style("visibility", "visible");
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
.exploration {
    background-color: rgba(238, 221, 142, 0.651);
    width: 100vw;
    height: 100vh;
}

.view-bottom {
    position:fixed;
    top: 5vh
}

div.exploration-unit {
    background-color: rgba(238, 221, 142, 0.651);
    position:fixed;
    top: 5vh;
    left: 5vw;
    right: 5vw;
    width: 90vw;
    height: 90vh;
}

.exploration-map {
    background-color: rgba(238, 221, 142, 0.651);
    position:fixed;
    top: 5vh;
    left: 5vw;
    right: 5vw;
    width: 90vw;
    height: 90vh;
    visibility: hidden;
}

.batch-filter {
    position:fixed;
    right: 40vw;
    // top: $gap + 5vh;
    bottom: 5vh;
    height: 5vh;
    width: 15vw;
}
</style>
