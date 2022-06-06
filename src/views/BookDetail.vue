<template>
  <div class="book-detail">
    <div class="content">
      <div class="img-wrapper">
        <img src="@/assets/placeholder.jpg" alt="" />
      </div>
      <div class="info">
        <div class="title">
          <span v-text="$route.params.bookID"></span>
          <span v-text="normalized_title"></span>
        </div>
        <p class="detail" v-text="book_data.detail"></p>
        <div class="related-books"></div>
        <div class="person">
          <table>
            <tr v-for="e in person_data" :key="e">
              <td>
                <router-link
                  v-text="'[' + e.dynasty_or_nation + ']' + e.责任人姓名"
                  :to="'/person-detail/' + e.责任人姓名"
                ></router-link>
              </td>
              <td v-text="e.责任行为"></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <BookInfoDialog
      ref="book-info-dialog"
      :id="hover_data.id"
      :title="hover_data.title"
      :detail="hover_data.detail"
    />
  </div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";
import BookInfoDialog from "@/components/BookInfoDialog";

export default {
  name: "BookDetail",
  components: { BookInfoDialog },
  data() {
    return {
      book_data: { content: "" },
      hover_data: {
        id: "",
        title: "",
        detail: "",
      },
      person_data: "",
    };
  },
  computed: {
    normalized_title() {
      // 临时规范题名
      return this.book_data.content.split("　")[0];
    },
  },
  mounted() {
    axios.get(`/data/book-detail/${this.$route.params.bookID}`).then((d) => {
      this.book_data = d.data[0][0];

      this.person_data = d.data[2];

      const related_books = d3.select(".related-books");
      related_books
        .selectAll("div")
        .data(d.data[1])
        .enter()
        .append("div")
        .style("width", "16px")
        .style("height", "16px")
        .style("border-radius", "50%")
        .style("background", "#4a3300")
        .style("display", "inline-block")
        .style("cursor", "pointer")
        .style("margin", "2px")
        .on("click", (e, d) => {
          this.$router.push(`/book-detail/${d.名录ID}`);
        })
        // .on("mouseenter", () => (this.$refs["book-info-dialog"].$el.style.display = "block"))
        .on("mousemove", (ev) => {
          this.$refs["book-info-dialog"].$el.style.left =
            ev.clientX + 10 + "px";
          this.$refs["book-info-dialog"].$el.style.top = ev.clientY + 30 + "px";
        })
        .on("mouseenter", (ev, data) => {
          ev.target.style.background = "#da9f21";
          this.$refs["book-info-dialog"].$el.style.display = "block";
          this.hover_data = {
            id: data.名录ID,
            title: this.$store.getters.getData.data
              .find((elem) => elem.id == data.名录ID)
              .content.split("　")[0],
            detail: this.$store.getters.getData.data.find(
              (elem) => elem.id == data.名录ID
            ).detail,
          };
        })
        .on("mouseleave", (ev) => {
          ev.target.style.background = "#4a3300";
          this.$refs["book-info-dialog"].$el.style.display = "none";
        });
    });
  },
};
</script>

<style lang="less" scoped>
.book-detail {
  background-color: #f2e0c4;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;

    .img-wrapper {
      background: #5e524a;
      height: 80vh;
      display: flex;
      align-items: center;
      margin: 0 2rem 0 0;
      img {
        width: 300px;
      }
    }
    .info {
      height: 80vh;
      .title {
        font-size: 2rem;
        margin: 0 0 1rem 0;
        span:first-child {
          color: #8f644d;
          margin: 0 1rem 0 0;
        }
        span:last-child {
          color: #4a3300;
        }
      }
      .detail {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
