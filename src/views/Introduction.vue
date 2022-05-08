<template>
  <div class="home">
    <section class="section-1">
      <h1>国家珍贵古籍名录</h1>
      <div>
        <p>《国家珍贵古籍名录》是由国务院批准发布的我国现存珍贵古籍目录。</p>
        <p>
          2007年，国务院办公厅发布《关于进一步加强古籍保护工作的意见》，启动了“中华古籍保护计划”。其中一项重要任务，就是建立《国家珍贵古籍名录》，实现国家对古籍的分级管理和保护，目的是要建立完备的珍贵古籍档案，确保珍贵古籍的安全。入选典籍为国内存世古籍中具有代表性的精品，且在《国家珍贵古籍名录》评审过程中，一些珍贵古籍的新品种、新版本、新价值被陆续发现。
        </p>
        <p>
          目前，国务院已批准公布六批《国家珍贵古籍名录》，全国487家机构/个人收藏的13026部古籍入选，囊括先秦两汉至明清时期的汉文古籍、少数民族文字古籍和其他文字古籍。
        </p>
      </div>
    </section>
    <section class="section-2"></section>
  </div>
</template>

<script>
export default {
  name: "Introduction",
};
</script>

<style lang="less" scoped>
.section-1 {
  background-color: #333;
  color: #fff;
  height: 100vh;
  padding: 5rem 0 0;
  box-sizing: border-box;
  h1 {
    text-align: center;
    font-size: 3rem;
    font-weight: normal;
    letter-spacing: 0.4rem;
    margin: 0 0 2rem;
  }
  div {
    width: 43%;
    margin: 0 auto;
    font-size: 0.8rem;
    font-weight: lighter;
    p {
      margin: 0 0 0.5rem;
      line-height: 1.3rem;
    }
  }
}
.section-2 {
  height: 100vh;
  background: linear-gradient(#b8a885, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #b8a885);
}
</style>
