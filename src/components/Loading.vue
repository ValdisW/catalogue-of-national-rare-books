<template>
  <div class="loading" v-show="!complete">loading...</div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    complete: Boolean,
  },
};
</script>

<style lang="less" scoped>
.loading {
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #333;
  color: #efefef;
  text-align: center;
  line-height: 100vh;
}
</style>
