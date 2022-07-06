<template>
  <Loading :complete="complete" />
  <div id="main-container" v-if="complete">
    <nav>
      <ul>
        <li @mouseenter="showSub = true" @mouseleave="showSub = false">
          <router-link to="/">名錄介紹</router-link>
          <ul v-show="showSub">
            <li><a href="#particles">首屏</a></li>
            <li><a href="#particles">粒子</a></li>
            <li><a href="#particles">統計</a></li>
            <li><a href="#particles">地點</a></li>
          </ul>
        </li>
        <li>
          <router-link to="/exploration">古籍瀏覽</router-link>
        </li>
        <li>
          <router-link to="/relationship">關係發現</router-link>
        </li>
      </ul>
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
      showSub: false,
    };
  },
  methods: {
    PageSize() {
      let width = window.innerWidth;
      let height = Math.min(window.innerHeight, (width * 9) / 16);
      width = (height * 16) / 9;
      let size = { width, height };
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
      let resources = Promise.all([axios.get("/data/")]);
      resources.then((res) => {
        this.$store.commit("loadData", res[0].data);
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
  font-family: "SourceHanSerif";
}
html {
  // font-size: 20px;
  overflow-y: hidden;
}
nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  ul {
    list-style: none;
    li {
      margin: 1rem;
      position: relative;
      a {
        color: #77664b;
        text-decoration: none;
        font-family: "SourceHanSerif";
        font-weight: normal;
      }
      ul {
        position: absolute;
        left: 3rem;
        top: 0;
        transform: translateY(-50%);
        li {
          width: 5rem;
        }
      }
    }
  }
}
#main-container {
  background-color: #f2e0c4;
}
</style>
