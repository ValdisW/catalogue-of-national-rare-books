<template>
  <div class="book-detail-tooltip">
    <div class="container">
      <div class="img-wrapper">
        <img src="@/assets/placeholder.jpg" alt="書影" />
      </div>
      <div class="content">
        <h4>
          <span v-text="id"></span>
          <span v-text="detail_data.content.split('　')[0]"></span>
        </h4>
        <router-link :to="'/book-detail/' + id">查看詳情</router-link>
        <div class="detail">
          <button id="test" @click="test">临时按钮</button>
          <p>
            <span>語種：</span>
            <span v-text="detail_data.language"></span>
          </p>
          <p>
            <span>版本年代/國別：</span>
            <span v-text="detail_data.edition_dynasty"></span>
          </p>
          <p>
            <span>文獻類型：</span>
            <span v-text="detail_data.document_type"></span>
          </p>
          <p>
            <span>批次：</span>
            <span v-text="detail_data.batch"></span>
          </p>
          <p>
            <span>館藏：</span>
            <span v-text="detail_data.institution"></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "bookDetailTooltip",
  props: {
    id: String,
  },
  computed: {
    detail_data() {
      if (!this.id) return { content: "　" };
      else return this.$store.state.allData.find((elem) => elem.id == this.id);
    },
  },
  methods: {
    test() {
      console.log("2333");
    },
  },
};
</script>

<style lang="less" scoped>
.book-detail-tooltip {
  position: absolute;
  display: none;
  z-index: 1000;

  .container {
    display: flex;
    .img-wrapper {
      height: 100px;
      img {
        height: 100%;
      }
    }
    .content {
      width: 13rem;
      background-color: #333;
      padding: 1.5rem;
      color: #fff;
      h4 {
        font-size: 0.9rem;
        span {
          display: block;
        }
      }
      a {
        color: #ccc;
      }
      .detail {
        font-size: 0.7rem;
        color: #ccc;
      }
    }
  }
}
</style>
