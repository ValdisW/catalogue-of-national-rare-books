<template>
  <div class="introduction" @wheel.prevent="rowScroll" ref="introduction">
    <section class="section-1">
      <div class="everyday-book">
        <div>
          <p>今日古籍</p>
          <p v-text="now.getDate()"></p>
          <p v-text="now.getFullYear() + '.' + (now.getMonth() + 1)"></p>
        </div>
        <div>
          <p>01523</p>
          <p>鲍氏国策十卷</p>
        </div>
        <img src="@/assets/placeholder.jpg" alt="今日古籍-书影" />
      </div>
      <div class="cover">
        <div>
          <div>
            <h1>国<br />家<br />珍<br />贵<br />古<br />籍<br />名<br />录</h1>
          </div>
        </div>
      </div>
      <div class="slider" @click="toNextPage()"></div>
      <div class="mouse-tip"></div>
    </section>
    <section class="section-2">
      <FlowingParticles />
    </section>
    <section class="section-3">
      <Stack />
    </section>
    <section class="section-4">
      <BaiduMap />
    </section>
  </div>
</template>

<script>
import FlowingParticles from "@/views/Exploration-Flow.vue";
import BaiduMap from "@/views/Exploration-BaiduMap.vue";
import Stack from "@/views/Exploration-Stack.vue";

export default {
  name: "Introduction",
  components: {
    FlowingParticles,
    BaiduMap,
    Stack,
  },
  data() {
    return {
      now: new Date(),
      everyday_book_list: ["01523", "01524", "01525", "01526"],
      scrolling: false,
      current_page: 1,
      page_width: Number,
    };
  },
  methods: {
    rowScroll(e) {
      // this.$refs.introduction.scrollLeft += e.deltaY; // 普通滚动
      if (!this.scrolling)
        if (e.deltaY > 0) this.toNextPage();
        else this.toPrevPage();
    },
    toNextPage() {
      if (this.current_page < 4) {
        this.moveToPage(this.current_page + 1);
      }
    },
    toPrevPage() {
      if (this.current_page > 1) {
        this.moveToPage(this.current_page - 1);
      }
    },
    moveToPage(target_page) {
      if (target_page > this.current_page) {
        let t = setInterval(() => {
          this.scrolling = true;
          this.$refs.introduction.scrollLeft += (this.page_width / 200) * (target_page - this.current_page);
          if (this.$refs.introduction.scrollLeft >= (target_page - 1) * this.page_width) {
            this.scrolling = false;
            this.current_page = target_page;
            clearInterval(t);
          }
        }, 1);
      } else {
        let t = setInterval(() => {
          this.scrolling = true;
          this.$refs.introduction.scrollLeft += (this.page_width / 200) * (target_page - this.current_page);
          if (this.$refs.introduction.scrollLeft <= (target_page - 1) * this.page_width) {
            this.scrolling = false;
            this.current_page = target_page;
            clearInterval(t);
          }
        }, 1);
      }
    },
  },
  mounted() {
    this.page_width = this.$refs.introduction.clientWidth;
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
}
.section-1 {
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 5rem 0 0;
  box-sizing: border-box;
  background: url(../assets/book-bg.png);
  .cover {
    background-color: #111;
    width: 20rem;
    height: 90vh;
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
    background-color: #0009;
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
      color: #fff;
      font-size: 0.8rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      p:nth-child(1) {
        margin: 0.5rem 0 0 0;
      }
      p:nth-child(2) {
        line-height: 0.9rem;
        width: 0.8rem;
        margin: 0.5rem 0 1rem;
      }
    }
    img {
      width: 100%;
    }
  }
}
</style>
