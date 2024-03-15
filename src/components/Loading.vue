<script lang="ts" setup>
defineProps({
  complete: { type: Boolean },
});
</script>

<template>
  <div class="loading" v-show="!complete">
    <div class="content">
      <div class="center">
        <div class="circle"></div>
        <h2>加載中</h2>
        <p>《國家珍貴古籍名録》知識庫</p>
        <p>2021年度國家古籍數字化工程專項經費資助項目</p>
      </div>
      <div class="bottom">
        <p>中國國家圖書館（中國國家古籍保護中心）</p>
        <p>北京大學數字人文研究中心</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@circle-color: #efefef;
@circle-size: 0.25rem;
@unit: 0.7rem;

.loading {
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  background: #333;
  user-select: none;
  .content {
    text-align: center;
    h2 {
      color: #efefef;
      font-weight: normal;
      margin: 0 0 0.3rem;
    }
    p {
      font-size: 0.7rem;
      color: #9c9c9c;
    }
    .center {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .circle {
        margin: 3.5rem auto;
        width: @circle-size;
        height: @circle-size;
        border-radius: 50%;
        animation: loading 1.35s infinite linear;
      }
    }
    .bottom {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translate(-50%, -50%);
    }
  }
}

@keyframes loading {
  0%,
  100% {
    box-shadow: 0 -3 * @unit 0 0.2 * @unit @circle-color, 2 * @unit -2 * @unit 0 0 * @unit @circle-color,
      3 * @unit 0 0 -1 * @unit @circle-color, 2 * @unit 2 * @unit 0 -1 * @unit @circle-color,
      0 3 * @unit 0 -1 * @unit @circle-color, -2 * @unit 2 * @unit 0 -1 * @unit @circle-color,
      -3 * @unit 0 0 -1 * @unit @circle-color, -2 * @unit -2 * @unit 0 0 @circle-color;
  }
  12.5% {
    box-shadow: 0 -3 * @unit 0 0 @circle-color, 2 * @unit -2 * @unit 0 0.2 * @unit @circle-color,
      3 * @unit 0 0 0 @circle-color, 2 * @unit 2 * @unit 0 -1 * @unit @circle-color,
      0 3 * @unit 0 -1 * @unit @circle-color, -2 * @unit 2 * @unit 0 -1 * @unit @circle-color,
      -3 * @unit 0 0 -1 * @unit @circle-color, -2 * @unit -2 * @unit 0 -1 * @unit @circle-color;
  }
  25% {
    box-shadow: 0 -3 * @unit 0 -0.5 * @unit @circle-color, 2 * @unit -2 * @unit 0 0 @circle-color,
      3 * @unit 0 0 0.2 * @unit @circle-color, 2 * @unit 2 * @unit 0 0 @circle-color,
      0 3 * @unit 0 -1 * @unit @circle-color, -2 * @unit 2 * @unit 0 -1 * @unit @circle-color,
      -3 * @unit 0 0 -1 * @unit @circle-color, -2 * @unit -2 * @unit 0 -1 * @unit @circle-color;
  }
  37.5% {
    box-shadow: 0 -3 * @unit 0 -1 * @unit @circle-color, 2 * @unit -2 * @unit 0 -1 * @unit @circle-color,
      3 * @unit 0 * @unit 0 0 @circle-color, 2 * @unit 2 * @unit 0 0.2 * @unit @circle-color,
      0 3 * @unit 0 0 * @unit @circle-color, -2 * @unit 2 * @unit 0 -1 * @unit @circle-color,
      -3 * @unit 0 * @unit 0 -1 * @unit @circle-color, -2 * @unit -2 * @unit 0 -1 * @unit @circle-color;
  }
  50% {
    box-shadow: 0 -3 * @unit 0 -1 * @unit @circle-color, 2 * @unit -2 * @unit 0 -1 * @unit @circle-color,
      3 * @unit 0 0 -1 * @unit @circle-color, 2 * @unit 2 * @unit 0 0 * @unit @circle-color,
      0 3 * @unit 0 0.2 * @unit @circle-color, -2 * @unit 2 * @unit 0 0 @circle-color,
      -3 * @unit 0 * @unit 0 -1 * @unit @circle-color, -2 * @unit -2 * @unit 0 -1 * @unit @circle-color;
  }
  62.5% {
    box-shadow: 0 -3 * @unit 0 -1 * @unit @circle-color, 2 * @unit -2 * @unit 0 -1 * @unit @circle-color,
      3 * @unit 0 0 -1 * @unit @circle-color, 2 * @unit 2 * @unit 0 -1 * @unit @circle-color,
      0 3 * @unit 0 0 @circle-color, -2 * @unit 2 * @unit 0 0.2 * @unit @circle-color, -3 * @unit 0 0 0 @circle-color,
      -2 * @unit -2 * @unit 0 -1 * @unit @circle-color;
  }
  75% {
    box-shadow: 0 * @unit -3 * @unit 0 -1 * @unit @circle-color, 2 * @unit -2 * @unit 0 -1 * @unit @circle-color,
      3 * @unit 0 * @unit 0 -1 * @unit @circle-color, 2 * @unit 2 * @unit 0 -1 * @unit @circle-color,
      0 3 * @unit 0 -1 * @unit @circle-color, -2 * @unit 2 * @unit 0 0 @circle-color,
      -3 * @unit 0 * @unit 0 0.2 * @unit @circle-color, -2 * @unit -2 * @unit 0 0 @circle-color;
  }
  87.5% {
    box-shadow: 0 * @unit -3 * @unit 0 0 @circle-color, 2 * @unit -2 * @unit 0 -1 * @unit @circle-color,
      3 * @unit 0 0 -1 * @unit @circle-color, 2 * @unit 2 * @unit 0 -1 * @unit @circle-color,
      0 3 * @unit 0 -1 * @unit @circle-color, -2 * @unit 2 * @unit 0 0 @circle-color,
      -3 * @unit 0 * @unit 0 0 @circle-color, -2 * @unit -2 * @unit 0 0.2 * @unit @circle-color;
  }
}
</style>
