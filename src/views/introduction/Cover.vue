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
  width: 13.9vh;
  display: flex;
  flex-direction: column;
  margin: 0 8.3vh 0 0;
  div:nth-child(1) {
    background-color: #ffda99;
    box-sizing: border-box;
    padding: 1.4vh;
    text-align: center;
    font-weight: bold;
    line-height: 4.4vh;
    p:nth-child(1) {
      font-size: 2.2vh;
    }
    p:nth-child(2) {
      font-size: 5vh;
    }
    p:nth-child(3) {
      font-size: 2.2vh;
    }
  }
  div:nth-child(2) {
    font-size: 2.2vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #0009;
    cursor: pointer;
    p:nth-child(1) {
      margin: 1.4vh 0 0 0;
      color: #efefef;
    }
    p:nth-child(2) {
      line-height: 2.5vh;
      width: 2.2vh;
      margin: 1.4vh 0 2.8vh;
      color: #efefef;
    }
  }
  .image-wrapper {
    width: 100%;
    height: 13.9vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #00000024;
    cursor: pointer;
  }
  img {
    width: 100%;
    height: 13.9vh;
    object-fit: contain;
  }
}
.cover {
  background-color: #111;
  user-select: none;
  width: 55.5vh;
  height: 86vh;
  margin: 2vh 0 0;
  box-shadow: 0.7vh 0.7vh 1.4vh 0 #0006;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  div {
    background: #ffda99;
    padding: 1.4vh;
    div {
      border: 0.55vh solid #111;
      padding: 0.4vh;
      h1 {
        border: 0.27vh solid #111;
        padding: 1.67vh 0.55vh 1.67vh 1.4vh;
        font-family: huawenkaiti, "华文楷体", "楷体";
        text-align: center;
        font-size: 6.4vh;
        line-height: 7.8vh;
        font-weight: normal;
        letter-spacing: 1.1vh;
      }
    }
  }
}
.slider {
  cursor: pointer;
  position: relative;
  margin: 0 0 4.2vh -1.4vh;
  width: 23.6vh;
  transition: 0.3s;
  z-index: 10;
  .s1 {
    width: 16.3vh;
    height: auto;
    position: absolute;
    z-index: 2;
  }
  .s2 {
    width: 3.9vh;
    height: auto;
    position: absolute;
    top: -5vh;
    left: 13.5vh;
    z-index: 1;
  }
  .mouse-tip {
    pointer-events: none;
    box-sizing: border-box;
    border: 2.78vh solid #fff8;
    border-radius: 50%;
    position: absolute;
    z-index: 21;
    top: -1.1vh;
    left: 12.5vh;
    width: 5.6vh;
    height: 5.6vh;
    animation: mousetip2 3s ease-out infinite;
  }
  &:hover {
    margin: 0 0 4.2vh 0;
    width: 22.2vh;
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
