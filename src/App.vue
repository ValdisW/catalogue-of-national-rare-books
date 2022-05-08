<template>
  <div id="nav">
    <router-link to="/">名录介绍</router-link> |
    <router-link to="/exploration">古籍浏览</router-link>
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
