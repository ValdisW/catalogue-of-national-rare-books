<script lang="ts" setup>
import { onUnmounted, provide, ref } from "vue";
import { useStore } from "@/store";
import { addManyData, readManyData } from "@/store/idb";
import { Province } from "#/axios";
import { loadIntroductionData, preloadIntroductionData } from "@/api";
// import MyWorker from "@/utils/worker.js?worker";
import FlowingParticles from "@/views/introduction/FlowingParticles.vue";
import BaiduMap from "@/views/introduction/BaiduMap.vue";
import Batches from "@/views/introduction/Batches.vue";
import Cover from "@/views/introduction/Cover.vue";

const sectionSum = 4;
const scrolling = ref(false); // 是否正在滚动，简单节流
const current_page = ref(0); // 当前的section，从0开始
const complete = ref(false);
const store = useStore();
const introductionData = ref();
const FlowingParticlesRef = ref<InstanceType<typeof FlowingParticles> | null>(
  null,
);
const emit = defineEmits(["openBookDetail", "startLoading", "endLoading"]);

provide("introductionData", introductionData);

// 请求数据
_loadIntroductionData().then((d) => {
  complete.value = true;

  // 浏览过程中加载
  loadIntroductionData().then((res) => {
    store.loadIntroductionData(res.data);
  });

  emit("endLoading");
});

// 加载introduction的数据。
// 优先从IDB中读取，如果IDB数据不完整就通过axios读取。
function _loadIntroductionData() {
  return new Promise((resolve) => {
    const tables = [
      "books",
      "all_edition_dynasty",
      "all_document_type",
      "all_catalogue",
      "all_edition_type",
      "all_language",
      "all_province",
      "all_institution",
      "all_image",
    ];
    readManyData(tables).then((d) => {
      if (d.every((el) => el.length > 0)) {
        // indexedDB已经有数据了，直接读
        introductionData.value = d;
        resolve(d);
      } else {
        // indexedDB没有数据，需要访问后端读取，同时将数据写入indexedDB
        preloadIntroductionData().then((d) => {
          // 设置机构和省份的归属关系，用来在地图界面展示
          for (let e of d.data[7]) {
            let r = d.data[6].find((el: Province) => el.id == e.province_id);
            if (!r.child) r.child = [];
            if (e.id != "0000") r.child.push(e.id);
          }
          introductionData.value = d.data; // 热乎的后端数据，这里先用来给provide变量
          addManyData(tables, d.data); // 将数据添加进indexedDB
          resolve(d.data);
        });
      }
    });
  });
}

function openBookDetail(book_id: string) {
  emit("openBookDetail", book_id);
}

function rowScroll(e: WheelEvent) {
  if (e.deltaY > 0 && !scrolling.value) toNextPage();
  else if (e.deltaY < 0 && !scrolling.value) toPrevPage();
  if (current_page.value == sectionSum - 1)
    FlowingParticlesRef.value?.continuePlay();
  else FlowingParticlesRef.value?.pause();
}

function toNextPage() {
  scrolling.value = true;
  current_page.value++;

  if (current_page.value > sectionSum - 1) current_page.value = sectionSum - 1;

  scrollToSection(current_page.value, true);
}

function toPrevPage() {
  scrolling.value = true;
  current_page.value--;

  if (current_page.value < 0) current_page.value = 0;

  scrollToSection(current_page.value, true);
}

/**
 * 横向滚动到指定的section，不触发滚动事件
 * @param {*} id section的id，四个section对应0~3
 * @param {*} force
 */
function scrollToSection(id: number, force = false) {
  let timeout;
  if (scrolling.value && !force) return false;

  current_page.value = id;
  scrolling.value = true;

  document
    .getElementsByTagName("section")
    [id].scrollIntoView({ behavior: "smooth", inline: "nearest" }); // 执行滚动

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    scrolling.value = false;
  }, 400);
}

onUnmounted(() => {
  emit("startLoading");
});
</script>

<template>
  <div
    class="introduction"
    @wheel.prevent="rowScroll"
    ref="introduction"
    v-if="complete"
  >
    <section class="section-1">
      <Cover @open-book-detail="openBookDetail" @to-next-page="toNextPage" />
    </section>
    <section class="section-2">
      <Batches @open-book-detail="openBookDetail" />
    </section>
    <section class="section-3">
      <BaiduMap @map-wheel="rowScroll" />
    </section>
    <section class="section-4">
      <FlowingParticles
        ref="FlowingParticlesRef"
        @open-book-detail="openBookDetail"
      />
    </section>

    <div class="badges">
      <span
        v-for="e in sectionSum"
        :key="e"
        :class="{ active: e - 1 == current_page }"
        @click="scrollToSection(e - 1, true)"
      ></span>
    </div>
  </div>
</template>

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
  box-sizing: border-box;
  background: url(../assets/book-bg.png) center no-repeat;
  background-size: cover;
}
</style>
