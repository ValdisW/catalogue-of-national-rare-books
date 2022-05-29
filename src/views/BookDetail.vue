<template>
  <div class="book-detail">
    <p v-text="$route.params.bookID"></p>
    <h1 v-text="book_data.content"></h1>
    <p v-text="book_data.detail"></p>
    <img src="@/assets/placeholder.jpg" alt="" />
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "BookDetail",
  data() {
    return {
      book_data: {},
    };
  },
  mounted() {
    axios.get(`/data/book-detail/${this.$route.params.bookID}`).then((d) => {
      this.book_data = d.data[0];
    });
  },
};
</script>

<style lang="less" scoped>
.book-detail {
  background-color: #f2e0c4;
  width: 100vw;
  height: 100vh;
  img {
    width: 300px;
  }
}
</style>
