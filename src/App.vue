<template>
  <!-- 不支持手机访问的提示 -->
  <MobileWarning v-if="mobileDetect()" />

  <!-- 加载提示 -->
  <transition name="bg-fade"><Loading :complete="complete" /></transition>

  <div id="main-container">
    <!-- 顶部导航 -->
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

    <!-- 用来显示四个主页面 -->
    <router-view
      v-slot="{ Component }"
      :key="$route.fullPath"
      @startLoading="complete = false"
      @endLoading="complete = true"
      @openBookDetail="openBookDetail"
      @openPersonDetail="openPersonDetail"
      @openInstitutionDetail="openInstitutionDetail"
    >
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <!-- 古籍详情页 -->
    <BookDetail @openPersonDetail="openPersonDetail" ref="book-detail" />

    <!-- 人物详情页 -->
    <PersonDetail @openBookDetail="openBookDetail" ref="person-detail" />

    <!-- 机构详情页（未使用） -->
    <InstitutionDetail ref="institution-detail" institutionID="201"></InstitutionDetail>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import MobileWarning from "@/components/MobileWarning.vue";
import BookDetail from "@/views/BookDetail.vue";
import PersonDetail from "@/views/PersonDetail.vue";
import InstitutionDetail from "@/views/InstitutionDetail.vue";

const baseSize = 20;  // 用于设置rem单位的基准值

export default {
  name: "App",
  components: {
    Loading,
    MobileWarning,
    BookDetail,
    PersonDetail,
    InstitutionDetail,
  },
  data() {
    return {
      complete: false,
      nav_pages: [
        { name: "名録介紹", router: "/" },
        { name: "名録瀏覽", router: "/exploration" },
        { name: "名録分析", router: "/relationship" },
        { name: "研發團隊", router: "/about" },
      ],
    };
  },
  methods: {
    openBookDetail(book_id) {
      this.$refs["book-detail"].open(book_id);
      this.$refs["person-detail"].close();
    },
    openPersonDetail(person_id) {
      console.log('openPersonDetail');
      this.$refs["book-detail"].close();
      this.$refs["person-detail"].open(person_id);
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

    mobileDetect() {
      return navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i);
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
  font-family: "SourceHanSerif", "宋体";
}
::selection {
  background: #68563a;
  color: #efefef;
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
  overflow-y: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  color: #201d1d;
}

.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 0.3s ease;
}

.bg-fade-leave-to {
  opacity: 0;
}

nav {
  position: fixed;
  width: 100%;
  user-select: none;
  z-index: 10;
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    li {
      margin: 1rem;
      position: relative;
      &:hover {
        text-decoration: underline;
      }
      a {
        color: #68563a88;
        text-decoration: none;
      }
      a.active {
        color: #68563a;
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
  }
}
#main-container {
  background: #f0e9dd;
}

.section-name {
  position: relative;
  display: flex;
  flex-direction: column;
  // border-left: 0.1rem solid #201d1d;
  // border-right: none;
  flex: 1.3rem 0 0;
  height: fit-content;
  align-items: center;
  justify-content: space-between;
  span {
    display: block;
  }
  span:first-child {
    width: 100%;
    height: 1.2rem;
    background: url(./assets/icons/side.svg) no-repeat;
    background-size: 100%;
  }
  span:nth-child(2) {
    width: 1rem;
    font-size: 0.7rem;
    text-align: center;
  }
  span:nth-child(3) {
    width: 100%;
    height: 1.2rem;
    background: url(./assets/icons/side.svg) no-repeat;
    background-size: 100%;
    transform: scaleY(-1);
  }
  span:last-child {
    position: absolute;
    left: -0.1rem;
    width: 0.1rem;
    height: 100%;
    background: #201d1d;
  }
}
</style>
