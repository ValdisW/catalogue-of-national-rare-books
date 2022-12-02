<template>
  <div class="loading" v-show="!complete">
    <div class="content">
      <div class="center">
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

<script>
export default {
  name: "Loading",
  props: {
    complete: Boolean,
  },
};
</script>

<style lang="less" scoped>
.loading {
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  background: #333;
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
    }
    .bottom {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
