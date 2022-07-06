<template>
  <div class="exploration-flow">
    <Slider v-on:changeRate="updateRate" />
    <FlowingParticles
      :rate="rate"
      :canvasWidth="toWidth(1)"
      :canvasHeight="toHeight(0.75)"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import FlowingParticles from "@/components/FlowingParticles.vue";
import Slider from "@/components/Slider.vue";

export default {
  name: "Exploration-Flow",
  components: {
    FlowingParticles,
    Slider,
  },
  data() {
    return {
      rate: null,
    };
  },
  computed: {
    ...mapState(["rem"]),
  },
  methods: {
    toWidth(p) {
      return window.innerWidth * p;
    },
    toHeight(p) {
      return window.innerHeight * p;
    },
    updateRate(rate) {
      this.rate = rate;
    },
  },
};
</script>

<style lang="less" scoped>
.exploration-flow {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>
