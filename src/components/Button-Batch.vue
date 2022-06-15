<template>
  <div class="container">
    <svg width="50" height="50">
      <g @click="clickBatch()">
        <circle
          style="cursor: pointer; fill: rgba(177, 44, 11); fill-opacity: 0.4"
          :id="`button-${index}`"
          cx="30"
          cy="30"
          r="20"
        ></circle>
        <text x="18" y="35">
          {{ text }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script>
// const d3 = require("d3")
export default {
  name: "Button-Batch",
  props: ["index", "text"],
  data() {
    return {
      show: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    clickBatch() {
      if (this.show == false) {
        this.show = true;
        this.$emit("addBatch", this.index);
        this.circle.setAttribute(
          "style",
          "cursor: pointer; fill: rgba(177, 44, 11); fill-opacity: 0.8"
        );
      } else {
        this.show = false;
        this.$emit("deleteBatch", this.index);
        this.circle.setAttribute(
          "style",
          "cursor: pointer; fill: rgba(177, 44, 11); fill-opacity: 0.4"
        );
      }
    },
  },
  mounted() {
    this.circle = document.getElementById("button-" + this.index);
    console.log(this.circle);
  },
};
</script>

<style scoped lang="less"></style>
