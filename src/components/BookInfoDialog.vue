<template>
  <div class="book-info-dialog">
    <h4>
      <span v-text="id"></span>
      <span v-text="title"></span>
    </h4>
    <p v-text="detail"></p>
  </div>
</template>

<script>
export default {
  name: "BookInfoDialog",
  props: {
    id: String,
    title: String,
    detail: String,
  },
};
</script>

<style lang="less" scoped>
.book-info-dialog {
  background-color: #333;
  padding: 1.5rem;
  max-width: 15rem;
  position: absolute;
  color: #efefef;
  display: none;
  z-index: 1000;
  h4 {
    font-size: 0.9rem;
    span {
      display: block;
    }
  }
  p {
    font-size: 0.7rem;
    color: #ccc;
  }
}
</style>
