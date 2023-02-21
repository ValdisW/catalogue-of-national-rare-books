<template>
  <div class="introduction" @wheel.prevent="rowScroll" ref="introduction" v-if="complete">
    <section class="section-1">
      <!-- 左侧今日古籍 -->
      <div class="everyday-book">
        <div>
          <p>今日古籍</p>
          <p v-text="now.getDate()"></p>
          <p v-text="now.getFullYear() + '.' + (now.getMonth() + 1)"></p>
        </div>

        <div @click="$emit('openBookDetail', recommendBook.id)">
          <p v-text="recommendBook.id"></p>
          <p v-text="recommendBook.name"></p>
        </div>

        <!-- 书影 -->
        <div class="image-wrapper" @click="$emit('openBookDetail', recommendBook.id)">
          <img
            @click="$emit('openBookDetail', d.data[0])"
            :src="getImageURL(recommendBook.id, $store.state.all_image)"
            alt="书影"
          />
        </div>
      </div>

      <!-- 中间封面 -->
      <div class="cover">
        <div>
          <div>
            <h1>國<br />家<br />珍<br />貴<br />古<br />籍<br />名<br />録</h1>
          </div>
        </div>
      </div>

      <!-- 右侧按钮，点击进入下一页 -->
      <div class="slider" @click="toNextPage()">
        <img class="s1" src="../assets/yb1.svg" />
        <img class="s2" src="../assets/yb2.svg" />
        <div class="mouse-tip"></div>
      </div>
    </section>
    <section class="section-2">
      <Batches @openBookDetail="openBookDetail" />
    </section>
    <section class="section-3">
      <BaiduMap />
    </section>
    <section class="section-4">
      <FlowingParticles ref="flowing-particles" @openBookDetail="openBookDetail" />
    </section>

    <div class="badges">
      <span
        v-for="e in 4"
        :key="e"
        :class="{ active: e - 1 == current_page }"
        @click="scrollToSection(e - 1, true)"
      ></span>
    </div>
  </div>
</template>

<script>
import FlowingParticles from "@/components/FlowingParticles.vue";
import BaiduMap from "@/views/Exploration-BaiduMap.vue";
import Batches from "@/views/Batches.vue";
import { getImageURL } from "@/utils/thumbnail";
import axios from "axios";

export default {
  name: "Introduction",
  components: {
    FlowingParticles,
    BaiduMap,
    Batches,
  },
  computed: {
    // 计算今日古籍
    recommendBook() {
      let t = this.$store.state.books.filter(
        (el) => el.name.length > 3 && el.name.length < 8 && !el.name.match(/(·|\?|（|\[)/i)
      );
      let d_books = [];
      for (let e of t) if (!d_books.find((el) => el.name == e.name)) d_books.push(e);

      return d_books[Math.floor(new Date().getTime() / 8.64e7) % d_books.length];
    },
  },
  data() {
    return {
      now: new Date(),
      scrolling: false,
      current_page: 0,
      page_width: Number,
      offsets: [],
      complete: false,
    };
  },
  methods: {
    getImageURL,
    openBookDetail(book_id) {
      this.$emit("openBookDetail", book_id);
    },
    calculateSectionOffsets() {
      let sections = document.querySelectorAll("section");
      let length = sections.length;
      for (let i = 0; i < length; i++) {
        let sectionOffset = sections[i].offsetRight;
        this.offsets.push(sectionOffset);
      }
    },

    rowScroll(e) {
      if (e.deltaY > 0 && !this.scrolling) this.toNextPage();
      else if (e.deltaY < 0 && !this.scrolling) this.toPrevPage();
      if (this.current_page == 3) this.$refs["flowing-particles"].continue();
      else this.$refs["flowing-particles"].pause();
    },

    toNextPage() {
      this.scrolling = true;
      this.current_page++;

      if (this.current_page > 3) this.current_page = 3;

      this.scrollToSection(this.current_page, true);
    },
    toPrevPage() {
      this.scrolling = true;
      this.current_page--;

      if (this.current_page < 0) this.current_page = 0;

      this.scrollToSection(this.current_page, true);
    },

    /**
     * 横向滚动到指定的section，不触发滚动事件
     * @param {*} id section的id，四个section对应0~3
     * @param {*} force
     */
    scrollToSection(id, force = false) {
      let timeout;
      if (this.scrolling && !force) return false;

      this.current_page = id;
      this.scrolling = true;

      document.getElementsByTagName("section")[id].scrollIntoView({ behavior: "smooth", inline: "nearest" }); // 执行滚动

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.scrolling = false;
      }, 400);
    },
  },

  mounted() {
    axios.get("/data/introduction-preload").then((res) => {
      this.$store.commit("preloadIntroductionData", res.data);

      for (let e of this.$store.state.all_institution) {
        let r = this.$store.state.all_province.find((el) => el.id == e.province_id);
        if (!r.child) r.child = [];
        if (e.id != "0000") r.child.push(e.id);
      }
      this.complete = true;
      this.$emit("endLoading");

      this.calculateSectionOffsets();

      window.addEventListener("DOMMouseScroll", this.handleMouseWheelDOM); // Mozilla Firefox
      window.addEventListener("mousewheel", this.handleMouseWheel, {
        passive: false,
      });
      // Other browsers
      window.addEventListener("touchstart", this.touchStart, {
        passive: false,
      });
      // mobile devices
      window.addEventListener("touchmove", this.touchMove, { passive: false }); // mobile devices

      // 浏览过程中加载
      axios.get("/data/introduction-load").then((res) => {
        this.$store.commit("loadIntroductionData", res.data);
      });
    });
  },
  unmounted() {
    this.$emit("startLoading");
    window.removeEventListener("mousewheel", this.handleMouseWheel, {
      passive: false,
    });
    // Other browsers
    window.removeEventListener("DOMMouseScroll", this.handleMouseWheelDOM); // Mozilla Firefox

    window.removeEventListener("touchstart", this.touchStart); // mobile devices
    window.removeEventListener("touchmove", this.touchMove); // mobile devices
  },
};
</script>

<style lang="less" scoped>
.introduction {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
  section {
    width: 100vw;
    height: 100vh;
    flex: 0 0 100vw;
    position: relative;
  }
  .badges {
    position: fixed;
    display: flex;
    left: 50%;
    bottom: 0.8rem;
    transform: translatex(-50%);
    span {
      display: block;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      border: 0.08rem solid #666;
      margin: 0 0.5rem;
      cursor: pointer;
      user-select: none;
    }
    span.active {
      background: #666;
    }
  }
}
.section-1 {
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 5rem 0 0;
  box-sizing: border-box;
  // object-fit: cover;
  background: url(../assets/book-bg.png) center no-repeat;
  background-size: cover;
  .cover {
    background-color: #111;
    user-select: none;
    width: 20rem;
    height: 86vh;
    margin: 2vh 0 0;
    box-shadow: 0.25rem 0.25rem 0.5rem 0 #0006;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;
    div {
      background: #ffda99;
      padding: 0.5rem;
      div {
        border: 0.2rem solid #111;
        padding: 0.15rem;
        h1 {
          border: 0.1rem solid #111;
          padding: 0.6rem 0.2rem 0.6rem 0.5rem;
          font-family: huawenkaiti, "华文楷体", "楷体";
          text-align: center;
          font-size: 2.3rem;
          line-height: 2.8rem;
          font-weight: normal;
          letter-spacing: 0.4rem;
        }
      }
    }
  }
  .slider {
    cursor: pointer;
    position: relative;
    margin: 0 0 1.5rem -0.5rem;
    width: 8.5rem;
    transition: 0.3s;
    z-index: 10;
    .s1 {
      width: 5.5rem;
      height: auto;
      position: absolute;
      z-index: 2;
    }
    .s2 {
      width: 1.4rem;
      height: auto;
      position: absolute;
      top: -1.8rem;
      left: 4.7rem;
      z-index: 1;
    }
    .mouse-tip {
      pointer-events: none;
      box-sizing: border-box;
      border: 1rem solid #fff8;
      border-radius: 50%;
      position: absolute;
      z-index: 21;
      top: -0.4rem;
      left: 4.5rem;
      width: 2rem;
      height: 2rem;
      animation: mousetip2 3s ease-out infinite;
    }
    &:hover {
      margin: 0 0 1.5rem 0;
      width: 8rem;
    }
  }

  // @keyframes mousetip1 {
  //   0% {
  //     left: 70vw;
  //   }
  //   70% {
  //     left: 80vw;
  //   }
  //   100% {
  //     left: 80vw;
  //     opacity: 0;
  //   }
  // }

  @keyframes mousetip2 {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(2);
      opacity: 0;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .everyday-book {
    width: 5rem;
    display: flex;
    flex-direction: column;
    margin: 0 3rem 0 0;
    div:nth-child(1) {
      background-color: #ffda99;
      box-sizing: border-box;
      padding: 0.5rem;
      text-align: center;
      font-weight: bold;
      line-height: 1.6rem;
      p:nth-child(1) {
        font-size: 0.8rem;
      }
      p:nth-child(2) {
        font-size: 1.8rem;
      }
      p:nth-child(3) {
        font-size: 0.8rem;
      }
    }
    div:nth-child(2) {
      font-size: 0.8rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #0009;
      cursor: pointer;
      p:nth-child(1) {
        margin: 0.5rem 0 0 0;
        color: #efefef;
      }
      p:nth-child(2) {
        line-height: 0.9rem;
        width: 0.8rem;
        margin: 0.5rem 0 1rem;
        color: #efefef;
      }
    }
    .image-wrapper {
      width: 100%;
      height: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #00000024;
      cursor: pointer;
    }
    img {
      width: 100%;
      height: 5rem;
      object-fit: contain;
    }
  }
}
</style>
