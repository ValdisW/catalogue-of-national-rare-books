<template>
  <router-link class="back" to="/exploration">返回</router-link>
</template>

<script>
export default {
  name: "BackButton",
};
</script>

<style lang="less" scoped>
.back {
  position: absolute;
  top: 30px;
  left: 30px;
  background-color: #4a3300;
  text-decoration: none;
  color: #fff;
  display: block;
}
</style>
