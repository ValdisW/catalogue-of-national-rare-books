<template>
  <div class="book-item" @click="$emit('openBookDetail', id)">
    <div>
      <img src="/images/placeholder.jpg" alt="書影" />
    </div>
    <p v-text="title"></p>
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
      title: this.$store.state.books.find((e) => e.id == this.id).name,
    };
  },
};
</script>

<style lang="less" scoped>
.book-item {
  flex: 5rem 1 1;
  margin: 0.2rem;
  cursor: pointer;
  div {
    background: #6666;
    height: 5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    img {
      height: 100%;
    }
  }
  p {
    font-size: 0.6rem;
    text-align: center;
    margin: 0.1rem 0 0;
    a {
      color: rgb(75, 28, 28);
      text-decoration: none;
    }
  }
}
</style>
