<template>
  <div class="introduction" @wheel.prevent="rowScroll" ref="introduction" v-if="complete">
    <section class="section-1">
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
        <div class="image-wrapper">
          <img
            @click="$emit('openBookDetail', d.data[0])"
            :src="`/data/images/thumbnails/${recommendBook.id}.jpg`"
            alt="书影"
          />
        </div>
      </div>
      <div class="cover">
        <div>
          <div>
            <h1>國<br />家<br />珍<br />貴<br />古<br />籍<br />名<br />録</h1>
          </div>
        </div>
      </div>
      <div class="slider" @click="toNextPage()"></div>
      <div class="mouse-tip"></div>
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
import axios from "axios";

export default {
  name: "Introduction",
  components: {
    FlowingParticles,
    BaiduMap,
    Batches,
  },
  computed: {
    recommendBook() {
      let t = this.$store.state.books.filter(
        (el) => el.name.length > 3 && el.name.length < 8 && !el.name.match(/(·|\?|（|\[)/i)
      );
      let d_books = [];
      for (let e of t) {
        if (!d_books.find((el) => el.name == e.name)) d_books.push(e);
      }
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
    openBookDetail(book_info) {
      this.$emit("openBookDetail", book_info);
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

    scrollToSection(id, force = false) {
      let timeout;
      if (this.scrolling && !force) return false;

      this.current_page = id;
      this.scrolling = true;

      document.getElementsByTagName("section")[id].scrollIntoView({ behavior: "smooth", inline: "nearest" });

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
      }); // Other browsers

      window.addEventListener("touchstart", this.touchStart, {
        passive: false,
      }); // mobile devices
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
    }); // Other browsers
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
    width: 20rem;
    height: 86vh;
    margin: 2vh 0 0;
    box-shadow: 5px 5px 10px 0 #666;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      background: #ffda99;
      padding: 10px;
      div {
        border: 4px solid #111;
        padding: 3px;
        h1 {
          border: 2px solid #111;
          padding: 12px 6px;
          font-family: "华文楷体";
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
    background-color: #2e2416;
    width: 7rem;
    height: 2rem;
    cursor: pointer;
  }

  @keyframes mousetip1 {
    0% {
      left: 70vw;
    }
    70% {
      left: 80vw;
    }
    100% {
      left: 80vw;
      opacity: 0;
    }
  }
  .mouse-tip {
    background: url(../assets/icons/mouse.svg) no-repeat;
    position: absolute;
    top: 55vh;
    left: 70vw;
    width: 2rem;
    height: 3rem;
    animation: mousetip1 4s ease-out infinite;
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
      background: #00000012;
    }
    img {
      width: 100%;
      height: 5rem;
      object-fit: contain;
    }
  }
}
</style>
