<template>
  <div class="barchart-test">
    <Barchart
        :canvasWidth="toWidth(0.8)"
        :canvasHeight="toHeight(0.8)"
        :title="title"
        :info="info"
    ></Barchart>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Barchart from "@/components/Barchart.vue";

const info = [
    {
        name: 'a',
        value: 12
    },
    {
        name: 'b',
        value: 112
    },
    {
        name: 'c',
        value: 1022
    },
]

export default {
  name: "Barchat-test",
  data() {
    return {
      info: info,
      title: "test_title"
    };
  },
  computed: {
    ...mapState(["rem"]),
  },
  components: {
    Barchart
  },
  watch: {
  },
  methods: {
    toWidth(p) {
      return window.innerWidth * p;
    },
    toHeight(p) {
      return window.innerHeight * p;
    },
  },
  mounted() {
  },
};
</script>

<style lang="less" scoped>
.barchart-test {
  left: 5vw;
  top: 5vh;
  position: absolute;
}
</style>
