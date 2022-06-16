<template>
  <div
    :class="{ 'batch-button': true, activated }"
    :id="`button-${index}`"
    @click="clickBatch()"
    v-text="text"
  ></div>
</template>

<script>
// const d3 = require("d3")
export default {
  name: "Button-Batch",
  props: ["index", "text"],
  data() {
    return {
      activated: false,
    };
  },
  methods: {
    clickBatch() {
      if (this.activated == false) {
        this.activated = true;
        this.$emit("addBatch", this.index);
      } else {
        this.activated = false;
        this.$emit("deleteBatch", this.index);
      }
    },
  },
};
</script>

<style scoped lang="less">
.batch-button {
  cursor: pointer;
  width: 1.8rem;
  height: 1.8rem;
  line-height: 1.8rem;
  border-radius: 50%;
  border: 1px solid #000;
  text-align: center;
  margin: 0.5rem;
  font-size: 0.8rem;
}
.activated {
  background-color: #000;
  color: #fff;
}
</style>
