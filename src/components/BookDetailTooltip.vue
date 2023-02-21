<!-- 粒子的悬浮框 -->
<template>
  <div class="book-detail-tooltip" v-show="show">
    <div class="container">
      <div class="content">
        <h4>
          <span v-text="id"></span>
          <span v-text="detail_data.name"></span>
        </h4>
        <div class="detail">
          <p>
            <span>批次：</span>
            <span v-text="'第' + detail_data.batch + '批'"></span>
          </p>
          <p>
            <span>文獻類型：</span>
            <span v-text="getDocumentTypeNameById(detail_data.document_type_id)"></span>
          </p>
          <p>
            <span>文種：</span>
            <span v-text="getLanguageNameById(detail_data.language_id)"></span>
          </p>
          <p>
            <span>版本朝代：</span>
            <span v-text="getEditionDynastyNameById(detail_data.edition_dynasty_id)"></span>
          </p>
          <p>
            <span>收藏單位：</span>
            <span v-text="getInstitutionNameById(detail_data.institution_id)"></span>
          </p>
        </div>
        <span class="to-detail" @click="openBookDetail">查看詳情</span>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from "@/Utils.vue";

export default {
  name: "bookDetailTooltip",
  props: {
    id: String,
  },
  data() {
    return {
      show: true,
    };
  },
  methods: {
    ...Utils.methods,
    open() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    openBookDetail() {
      this.close();
      this.$emit("openBookDetail", this.id);
    },
  },
  computed: {
    detail_data() {
      if (!this.id) return { content: "　" };
      else return this.$store.state.books.find((el) => el.id == this.id);
    },
  },
};
</script>

<style lang="less" scoped>
.book-detail-tooltip {
  position: absolute;
  // display: none;
  z-index: 1000;

  .container {
    display: flex;

    .content {
      width: 13rem;
      background-color: #333;
      padding: 1rem;
      color: #efefef;

      h4 {
        font-size: 0.9rem;

        span {
          display: block;
          color: #efefef;
        }
      }

      span.to-detail {
        color: #bbb;
        font-size: 0.7rem;
        text-decoration: underline;
        cursor: pointer;
      }

      .detail {
        font-size: 0.7rem;
        margin: 0.2rem 0 0;
        p {
          color: #ccc;
        }
      }
    }
  }
}
</style>
