<template>
  <Loading :complete="complete" />
  <div id="main-container" v-if="complete">
    <nav>
      <router-link to="/">名录介绍</router-link> |
      <router-link to="/exploration">古籍浏览</router-link>
    </nav>
    <router-view v-slot="{ Component }" :key="$route.fullPath">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "@/components/Loading";

const baseSize = 20;

export default {
  name: "App",
  components: { Loading },
  data() {
    return {
      complete: false,
    };
  },
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
    loadData() {
      axios.get("/data/").then((res) => {
        this.$store.commit("loadData", res.data);
        this.complete = true;
      });
    },
    init() {
      this.setRem();
      window.onresize = () => {
        this.init();
      };
      this.loadData();
    },
  },
  mounted() {
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
}
nav {
  position: fixed;
  z-index: 100;
}
#main-container {
  background-color: #f2e0c4;
}
</style>
