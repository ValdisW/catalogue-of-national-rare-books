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
          <h1>国家珍贵古籍名录</h1>
        </div>
      </div>
      <div class="slider"></div>
      <router-link to="/exploration">转到检索系统>></router-link>
    </section>
    <section class="section-2">
      <FlowingParticles />

      <!-- <div>
        <p>《国家珍贵古籍名录》是由国务院批准发布的我国现存珍贵古籍目录。</p>
        <p>
          2007年，国务院办公厅发布《关于进一步加强古籍保护工作的意见》，启动了“中华古籍保护计划”。其中一项重要任务，就是建立《国家珍贵古籍名录》，实现国家对古籍的分级管理和保护，目的是要建立完备的珍贵古籍档案，确保珍贵古籍的安全。入选典籍为国内存世古籍中具有代表性的精品，且在《国家珍贵古籍名录》评审过程中，一些珍贵古籍的新品种、新版本、新价值被陆续发现。
        </p>
        <p>
          目前，国务院已批准公布六批《国家珍贵古籍名录》，全国487家机构/个人收藏的13026部古籍入选，囊括先秦两汉至明清时期的汉文古籍、少数民族文字古籍和其他文字古籍。
        </p>
      </div> -->
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
    };
  },
  methods: {
    rowScroll(e) {
      this.$refs.introduction.scrollLeft += e.deltaY;
    },
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
  .cover {
    background-color: #333;
    width: 20rem;
    height: 90vh;
    box-shadow: 5px 5px 10px 0 #666;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      background: #ffda99;
      width: 3rem;
      h1 {
        text-align: center;
        font-size: 2.3rem;
        font-weight: normal;
        letter-spacing: 0.4rem;
        margin: 0 0 2rem;
      }
    }
  }
  .slider {
    background-color: #2e2416;
    width: 7rem;
    height: 2rem;
    cursor: pointer;
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
      p:nth-child(1) {
        font-size: 0.8rem;
      }
      p:nth-child(2) {
        font-size: 1.8rem;
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
  a {
    position: absolute;
    bottom: 3rem;
    right: 6rem;
    color: #666;
  }
}
</style>
