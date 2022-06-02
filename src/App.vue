<template>
  <keep-alive exclude="book-detail">
    <router-view :key="$route.fullPath" />
  </keep-alive>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.$store.commit("loadData");
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html {
  font-size: 20px;
  overflow-y: hidden;
  background-color: #f2e0c4;
}
</style>
