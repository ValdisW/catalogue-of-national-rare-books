<template>
  <div class="book-item" @click="openBookDetail">
    <div :style="`background-image: url(${cover_url})`">
      <!-- <img :src="cover_url" :alt="id" @error="showDefaultImg" /> -->
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
  computed: {
    /**
     * 计算书影缩略图的url
     */
    cover_url() {
      let img_res = this.$store.state.all_image.filter((el) => el.id == this.id); // 从vuex获取书影数据
      return img_res[0].allowed ? `/data/images/thumbnails/${this.id}.jpg` : "/data/images/thumbnails/placeholder.jpg";
    },
  },
  methods: {
    openBookDetail() {
      this.$emit("openBookDetail", this.id);
    },
    showDefaultImg(e) {
      e.target.src = "/data/images/thumbnails/placeholder.jpg";
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
  flex: 7rem 1 1;
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  cursor: pointer;
  transition: 0.1s;
  &:hover {
    filter: brightness(0.9);
    div {
      background-color: #00000020;
    }
  }
  div {
    background: #00000012;
    // background-image: url(/data/images/thumbnails/placeholder.jpg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    flex: auto 1 1;
    width: 100%;
    display: flex;
    justify-content: center;
    // img {
    //   object-fit: contain;
    //   width: 100%;
    //   height: 100%;
    // }
  }

  p {
    flex: auto 0 0;
    font-size: 0.6rem;
    text-align: center;
    margin: 0.1rem 0 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
</style>
