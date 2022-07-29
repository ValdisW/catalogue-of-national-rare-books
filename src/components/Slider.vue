<template>
  <div class="scroll-bar" @mouseup="up">
    <div class="bar-axis"></div>
    <div
      class="bar-block"
      @mousedown.prevent="handleDown"
      ref="bar-block"
    ></div>
  </div>
</template>

<script>
// const d3 = require("d3");
export default {
  name: "Slider",
  props: ["canvasWidth", "canvasHeight"],
  data() {
    return {
      // rate: -0.1,
      rate: 0,
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.1,
      isMouseDown: false,
      startX: null,
      currentX: 0,
    };
  },
  watch: {
    rate(newVal) {
      this.$emit("changeRate", newVal);
    },
  },
  methods: {
    handleDown(e) {
      this.isMouseDown = true;
      this.startX = e.offsetX;
      // let x = e.offsetX - this.bar_width / 2;
      // if (x < 0) x = 0;
      // if (x + this.bar_width >= this.width) x = this.width - this.bar_width;
      // e.target.style.left = x + "px";
      // this.rate = x / this.width;
      window.addEventListener("mousemove", this.handleMove);
    },
    handleMove(e) {
      if (this.isMouseDown && e.target.className == "bar-block") {
        this.currentX += e.offsetX - this.startX;
        if (this.currentX < 0) this.currentX = 0;
        if (this.currentX > this.width) this.currentX = this.width;
        this.$refs["bar-block"].style.left = this.currentX + "px";
        // this.rate = (this.currentX / this.width) * 1.2 - 0.1;
        this.rate = this.currentX / this.width;
      }
    },
    up() {
      this.isMouseDown = false;
    },
  },
};
</script>

<style scoped lang="less">
.scroll-bar {
  position: absolute;
  // width: 50vw;
  height: 10vh;
  left: 10vw;
  bottom: 5vh;
  z-index: 1000;
  .bar-axis {
    width: 80vw;
    height: 1px;
    background-color: #666;
    position: absolute;
    top: 50%;
  }
  .bar-block {
    width: 2rem;
    height: 2rem;
    background-color: #fff7;
    border: 2px solid #000;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%) rotate(45deg);
    cursor: pointer;
  }
}
</style>
