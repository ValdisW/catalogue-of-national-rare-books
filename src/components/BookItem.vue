<template>
  <div class="book-item" @click="openBookDetail">
    <div>
      <img src="/images/placeholder.jpg" alt="書影" />
    </div>
    <p v-text="title"></p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BookItem",
  props: {
    id: String,
  },
  methods: {
    openBookDetail() {
      axios.get(`/data/get-book-data/${this.id}`).then((d) => {
        this.$emit("openBookDetail", d.data[0]);
        console.log(d.data);
      });
    },
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
  flex: 6rem 1 1;
  margin: 0.2rem;
  cursor: pointer;

  div {
    background: #6666;
    height: 5rem;
    width: 100%;
    display: flex;
    justify-content: center;

    img {
      object-fit: contain;
    }
  }

  p {
    font-size: 0.6rem;
    text-align: center;
    margin: 0.1rem 0 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;

    a {
      color: rgb(75, 28, 28);
      text-decoration: none;
    }
  }
}
</style>
