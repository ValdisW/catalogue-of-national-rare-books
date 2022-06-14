
<template>
  <div class='exploration-stack'>
    <Stack class="stack" :canvasWidth="toWidth(0.7)" :canvasHeight="toHeight(0.8)" :batchSel="batchSel"></Stack>
    <div class='button-batch'>
      <ButtonBatch v-for="(batch, index) in batchKeys"
        :key="index"
        :text="batch"
        :index="index"
        v-on:addBatch="addBatch"
        v-on:deleteBatch="deleteBatch">
      </ButtonBatch>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex"
import global from "@/constants/global"

import Stack from "@/components/Stack.vue"
import ButtonBatch from "@/components/Button-Batch.vue"

const baseSize = 16
const batchKeys = [
    '第1批', '第2批', '第3批', '第4批', '第5批', '第6批'
]

export default {
  name: "Exploration-Stream",
  data() {
    return {
      batchSel: null,
      batchKeys: batchKeys
    }
  },
  computed: {
    ...mapState(['rem']),
  },
  components: {
    Stack,
    ButtonBatch,
  },
  watch: {
    batchSel: function(newVal, oldVal) {
      console.log(newVal, oldVal)
    }
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
    addBatch(index) {
      let sel = this.batchSel.slice(0)
      sel[index]=1
      this.batchSel = sel
    },
    deleteBatch(index) {
      let sel = this.batchSel.slice(0)
      sel[index]=0
      this.batchSel = sel
    }
  },
  created() {
  },
  mounted() {
    let self = this
    self.init()
    this.batchSel = new Array(6).fill(0)
  }
};
</script>

<style lang="less" scoped>
// .about {
//   width: 100vw;
//   height: 100vh;
//   background: linear-gradient(#b8a885, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #b8a885);
// }

.exploration-stack {
  background-color: rgba(238, 221, 142, 0.651);
  width: 100vw;
  height: 100vh;
  .stack {
    position: fixed;
    left: 20vw;
    top: 10vh;
  }
}
</style>
