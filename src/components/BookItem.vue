<template>
  <div class="book-item">
    <div>
      <img src="@/assets/placeholder.jpg" alt="書影" />
    </div>
    <p><router-link :to="'/book-detail/' + id" v-text="title"></router-link></p>
  </div>
</template>

<script>
export default {
  name: "BookItem",
  props: {
    id: String,
  },
  data() {
    return {
      title: this.$store.state.allData
        .find((e) => e.id == this.id)
        .content.split("　")[0],
    };
  },
};
</script>

<style lang="less" scoped>
.book-item {
  width: 100px;
  div {
    background: #6666;
    height: 100px;
    display: flex;
    justify-content: center;
    img {
      height: 100%;
    }
  }
  p {
    font-size: 0.7rem;
    text-align: center;
  }
}
</style>
