<script lang="ts" setup>
import { inject, ref } from "vue";
import { getImageURL } from "@/utils/thumbnail";
import { Book } from "#/axios";

const emit = defineEmits(["openBookDetail", "toNextPage"]);
const { 0: books, 8: images } = inject("introductionData").value;
const now = new Date(); // 用于显示今日古籍上的日期
const recommendBook = ref({ id: books[0].id, name: books[0].name });

recommendBook.value = getRecommendBook(books);

function getRecommendBook(all_books: Book[]) {
  let t = all_books
    .map((e) => ({ id: e.id, name: e.name }))
    .filter(
      (el: Book) =>
        el.name!.length > 3 &&
        el.name!.length < 8 &&
        !el.name!.match(/(·|\?|（|\[)/i),
    );
  let d_books: Array<Book> = [];
  for (let e of t)
    if (!d_books.find((el) => el.name === e.name)) d_books.push(e);
  return d_books[Math.floor(new Date().getTime() / 8.64e7) % d_books.length];
}
</script>

<template>
  <!-- 左侧今日古籍 -->
  <div class="everyday-book">
    <div>
      <p>今日古籍</p>
      <p v-text="now.getDate()"></p>
      <p v-text="now.getFullYear() + '.' + (now.getMonth() + 1)"></p>
    </div>

    <div @click="emit('openBookDetail', recommendBook.id)">
      <p v-text="recommendBook.id"></p>
      <p v-text="recommendBook.name"></p>
    </div>

    <!-- 书影 -->
    <div
      class="image-wrapper"
      @click="emit('openBookDetail', recommendBook.id)"
    >
      <img
        @click="emit('openBookDetail', recommendBook.id)"
        :src="getImageURL(recommendBook.id, images)"
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
  <div class="slider" @click="emit('toNextPage')">
    <img class="s1" src="@/assets/yb1.svg" />
    <img class="s2" src="@/assets/yb2.svg" />
    <div class="mouse-tip"></div>
  </div>
</template>

<style lang="less" scoped>
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
</style>
