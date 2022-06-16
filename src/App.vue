<template>
  <nav>
    <router-link to="/">名录介绍</router-link> |
    <router-link to="/exploration">古籍浏览</router-link>
  </nav>
  <router-view v-slot="{ Component }" :key="$route.fullPath">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script>
const baseSize = 20;

export default {
  name: "App",

  methods: {
    PageSize() {
      let width = window.innerWidth;
      let height = Math.min(window.innerHeight, (width * 9) / 16);
      width = (height * 16) / 9;
      let size = { width, height };
      console.log(size);
      return size;
    },
    setRem() {
      // 用于根据页面大小设定rem，以自适应元素大小
      const scale = this.PageSize().width / 1280;
      let rem = baseSize * Math.min(scale, 50);
      this.$store.commit("changeRem", rem);
      document.documentElement.style.fontSize = rem + "px";
    },
    init() {
      this.setRem();
      window.onresize = () => {
        this.init();
      };
    },
  },
  mounted() {
    this.$store.commit("loadData");

    this.init();
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html {
  // font-size: 20px;
  overflow-y: hidden;
  background-color: #f2e0c4;
}
nav {
  position: fixed;
  z-index: 100;
}
</style>
