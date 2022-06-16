<template>
  <div class="exploration-stack">
    <Stack
      class="stack"
      :canvasWidth="toWidth(0.7)"
      :canvasHeight="toHeight(0.8)"
      :batchSel="batchSel"
    ></Stack>
    <div class="button-batch">
      <ButtonBatch
        v-for="(batch, index) in batchKeys"
        :key="index"
        :text="batch"
        :index="index"
        v-on:addBatch="addBatch"
        v-on:deleteBatch="deleteBatch"
      >
      </ButtonBatch>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Stack from "@/components/Stack.vue";
import ButtonBatch from "@/components/Button-Batch.vue";

const batchKeys = ["一", "二", "三", "四", "五", "六"];

export default {
  name: "Exploration-Stream",
  data() {
    return {
      batchSel: null,
      batchKeys: batchKeys,
    };
  },
  computed: {
    ...mapState(["rem"]),
  },
  components: {
    Stack,
    ButtonBatch,
  },
  watch: {
    batchSel: function (newVal, oldVal) {
      console.log(newVal, oldVal);
    },
  },
  methods: {
    toWidth(p) {
      return window.innerWidth * p;
    },
    toHeight(p) {
      return window.innerHeight * p;
    },

    addBatch(index) {
      let sel = this.batchSel.slice(0);
      sel[index] = 1;
      this.batchSel = sel;
    },
    deleteBatch(index) {
      let sel = this.batchSel.slice(0);
      sel[index] = 0;
      this.batchSel = sel;
    },
  },
  mounted() {
    this.batchSel = new Array(6).fill(0);
  },
};
</script>

<style lang="less" scoped>
.exploration-stack {
  width: 100vw;
  height: 100vh;
  position: relative;
  .button-batch {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .stack {
    position: absolute;
    left: 20vw;
    top: 10vh;
  }
}
</style>
