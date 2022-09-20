<template>
  <Loading :complete="complete" />
  <div id="main-container">
    <nav>
      <ul>
        <li v-for="page in nav_pages" :key="page.name">
          <router-link
            :class="{ active: $router.currentRoute.value.path == page.router }"
            :to="page.router"
            v-text="page.name"
          ></router-link>
        </li>
      </ul>
    </nav>

    <router-view
      v-slot="{ Component }"
      :key="$route.fullPath"
      @startLoading="complete = false"
      @endLoading="complete = true"
      @openBookDetail="openBookDetail"
      @openInstitutionDetail="openInstitutionDetail"
    >
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <BookDetail ref="book-detail" />
    <InstitutionDetail
      ref="institution-detail"
      institutionID="201"
    ></InstitutionDetail>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import BookDetail from "@/views/BookDetail";
import InstitutionDetail from "@/views/InstitutionDetail";

const baseSize = 20;

export default {
  name: "App",
  components: { Loading, BookDetail, InstitutionDetail },
  data() {
    return {
      complete: false,

      nav_pages: [
        { name: "名錄介紹", router: "/" },
        { name: "古籍瀏覽", router: "/exploration" },
        { name: "書目分析", router: "/relationship" },
        { name: "關於我們", router: "/about" },
      ],
    };
  },
  methods: {
    openBookDetail(book_data) {
      this.$refs["book-detail"].open(book_data);
    },
    openInstitutionDetail(institution_id) {
      this.$refs["institution-detail"].open(institution_id);
    },
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

    init() {
      this.setRem();
      window.onresize = () => {
        this.init();
      };
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
::selection {
  background: #77664b;
  color: #fff;
}
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.632);
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}

html {
  // font-size: 20px;
  overflow-y: hidden;
}
nav {
  position: fixed;
  width: 100%;
  user-select: none;
  // left: 50%;
  // transform: translateX(-50%);
  z-index: 10;
  // background: rgb(202, 185, 167);
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    li {
      margin: 1rem;
      position: relative;
      a {
        color: #77664b66;
        // color: #77664b;
        text-decoration: none;
        font-family: "SourceHanSerif";
        font-weight: normal;
      }
      a.active {
        color: #77664b;
      }
      ul {
        display: block;
        position: absolute;
        left: 0;
        top: 5.5rem;
        transform: translateY(-50%);
        li {
          width: 5rem;
        }
      }
    }
    li:hover {
      text-decoration: underline;
    }
  }
}
#main-container {
  // background-color: #f2e0c4;
  background-color: #f0e9dd;
}
</style>
