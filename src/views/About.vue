<template>
  <div class="about">
    <h1>關於我們</h1>
    <div>
      <p>
        “《國家珍貴古籍名録》知識庫”爲“中華古籍保護計劃”成果之一，是由中國國家圖書館（國家古籍保護中心）主持建設，并與北京大學數字人文研究中心共同製作的古籍知識庫。
      </p>
      <p>此建設項目爲2021年度國家古籍數字化工程專項經費資助項目。</p>

      <p>聯繫我們：</p>
      <p>國家古籍保護中心辦公室</p>
      <p>電話：010-88544649</p>
      <p>郵箱：gjgjbhzx@nlc.cn</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  mounted() {
    this.$emit("endLoading");
  },
  unmounted() {
    this.$emit("startLoading");
  },
};
</script>

<style lang="less" scoped>
.about {
  width: 100vw;
  height: 100vh;
  padding: 2rem 5rem;
  box-sizing: border-box;
  h1 {
    text-align: center;
  }
  p {
    margin: 0.5rem 0;
    font-size: 0.8rem;
  }
}
</style>
