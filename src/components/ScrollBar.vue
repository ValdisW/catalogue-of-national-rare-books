<template>
  <div class="scroll-bar" @mouseup="up">
    <div class="bar-axis"></div>
    <div class="bar-block" @mousedown="down" @mousemove="move"></div>
  </div>
</template>

<script>
// const d3 = require("d3");
export default {
  name: "ScrollBar",
  props: ["canvasWidth", "canvasHeight"],
  data() {
    return {
      rate: -0.1,
      width: this.$store.state.rem * 20,
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
    down(e) {
      this.isMouseDown = true;
      this.startX = e.offsetX;
      // let x = e.offsetX - this.bar_width / 2;
      // if (x < 0) x = 0;
      // if (x + this.bar_width >= this.width) x = this.width - this.bar_width;
      // e.target.style.left = x + "px";
      // this.rate = x / this.width;
    },
    move(e) {
      if (this.isMouseDown) {
        this.currentX += e.offsetX - this.startX;
        if (this.currentX < 0) this.currentX = 0;
        if (this.currentX > this.width) this.currentX = this.width;
        e.target.style.left = this.currentX + "px";
        this.rate = (this.currentX / this.width) * 1.2 - 0.1;
      }
    },
    up() {
      console.log("mouseup");
      this.isMouseDown = false;
    },
  },
};
</script>

<style scoped lang="less">
.scroll-bar {
  position: absolute;
  width: 50vw;
  height: 10vh;
  left: 10vw;
  top: 10vh;
  .bar-axis {
    width: 20rem;
    height: 1px;
    background-color: #000;
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
