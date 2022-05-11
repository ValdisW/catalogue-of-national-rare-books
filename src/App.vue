<template>
  <div id="nav">
    <router-link to="/">名录介绍</router-link> |
    <router-link to="/exploration-unit">古籍浏览-点阵</router-link> |
    <router-link to="/exploration-map">古籍浏览-地图</router-link>
  </div>
  <router-view />
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html {
  font-size: 20px;
}
#nav {
  position: fixed;
  a {
    color: #fff;
  }
}
</style>
