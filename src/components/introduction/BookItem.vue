<script lang="ts" setup>
import { computed, inject, ref } from "vue";

import { useStore } from "@/store";
// import { readData } from "@/store/idb";

const emit = defineEmits(["openBookDetail"]);

const title = ref("");

const books = inject("introductionData").value[0];
const store = useStore();
title.value = books.find((e) => e.id == props.id).name;

const props = defineProps({
  id: String,
});

/**
 * 计算书影缩略图的url
 * （使用缺省封面的逻辑：allowed为0表示不公开，或filename为空表示无图片）
 */
const cover_url = computed(() => {
  let img_res = store.all_image.filter((el) => el.id == props.id)[0]; // 从vuex获取书影数据
  return img_res.allowed && img_res.filename
    ? `/data/images/thumbnails/${props.id}.jpg`
    : "/data/images/thumbnails/placeholder.jpg";
});

function openBookDetail() {
  emit("openBookDetail", props.id);
}

function showDefaultImg(e) {
  e.target.src = "/data/images/thumbnails/placeholder.jpg";
}

defineExpose({
  showDefaultImg,
});
</script>

<template>
  <div class="book-item" @click="openBookDetail">
    <div :style="`background-image: url(${cover_url})`">
      <!-- <img :src="cover_url" :alt="id" @error="showDefaultImg" /> -->
    </div>
    <p v-text="title"></p>
  </div>
</template>

<style lang="less" scoped>
.book-item {
  flex: 7rem 1 1;
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  cursor: pointer;
  transition: 0.1s;
  &:hover {
    filter: brightness(0.9);
    div {
      background-color: #00000020;
    }
  }
  div {
    background: #00000012;
    // background-image: url(/data/images/thumbnails/placeholder.jpg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    flex: auto 1 1;
    width: 100%;
    display: flex;
    justify-content: center;
    // img {
    //   object-fit: contain;
    //   width: 100%;
    //   height: 100%;
    // }
  }

  p {
    flex: auto 0 0;
    font-size: 0.6rem;
    text-align: center;
    margin: 0.1rem 0 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
</style>
