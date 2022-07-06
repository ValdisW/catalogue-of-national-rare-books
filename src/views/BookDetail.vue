<template>
  <div class="book-detail">
    <BackButton />
    <div class="content">
      <div class="img-wrapper">
        <img src="@/assets/placeholder.jpg" alt="" />
      </div>
      <div class="info">
        <div class="title">
          <span v-text="$route.params.bookID"></span>
          <span v-text="normalized_title"></span>
        </div>
        <div class="detail">
          <p class="edition-dynasty">
            <span>版本年代：</span
            ><span v-text="book_data.edition_dynasty"></span>
          </p>
          <p class="document-type">
            <span>版本類型：</span
            ><span v-text="book_data.document_type"></span>
          </p>
          <p><span>語種：</span><span v-text="book_data.language"></span></p>
          <p><span>館藏：</span><span v-text="book_data.institution"></span></p>
          <p>
            <span>數量：</span
            ><span v-text="book_data.quantity + book_data.measurement"></span>
          </p>
        </div>
        <div class="related-books">
          <p
            v-for="b in this.related_books"
            :key="b.名录ID"
            v-text="
              $store.state.allData
                .find((elem) => elem.id == b.名录ID)
                .content.split('　')[0]
            "
          ></p>
        </div>
        <div class="person">
          <table>
            <tr v-for="e in person_data" :key="e">
              <td>
                <router-link
                  v-if="e.责任人姓名"
                  v-text="
                    '[' + (e.dynasty_or_nation || '？') + ']' + e.责任人姓名
                  "
                  :to="'/person-detail/' + e.责任人姓名"
                ></router-link>
                <span
                  v-else
                  v-text="'[' + (e.dynasty_or_nation || '？') + ']佚名'"
                ></span>
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
// import * as d3 from "d3";
import BookInfoDialog from "@/components/BookInfoDialog";
import BackButton from "@/components/BackButton";

export default {
  name: "BookDetail",
  components: { BookInfoDialog, BackButton },
  data() {
    return {
      book_data: { content: "" },
      hover_data: {
        id: "",
        title: "",
        detail: "",
      },
      person_data: [],
      seal_data: [],
      related_books: [],
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
      console.log(this.book_data);

      this.related_books = d.data[1];
      this.person_data = d.data[2];
      this.seal_data = d.data[3];

      // const related_books = d3.select(".related-books");
      // related_books
      //   .selectAll("div")
      //   .data(d.data[1])
      //   .enter()
      //   .append("div")
      //   .style("width", "16px")
      //   .style("height", "16px")
      //   .style("border-radius", "50%")
      //   .style("background", "#4a330066")
      //   .style("display", "inline-block")
      //   .style("cursor", "pointer")
      //   .style("margin", "2px")
      //   .style("position", "absolute")
      //   .style("left", (e, i, a) => `${250 + (200 - e.count * 10) * Math.cos(((Math.PI * 2) / a.length) * i)}px`)
      //   .style("top", (e, i, a) => `${250 + (200 - e.count * 10) * Math.sin(((Math.PI * 2) / a.length) * i)}px`)
      //   .on("click", (e, d) => {
      //     this.$router.push(`/book-detail/${d.名录ID}`);
      //   })
      //   // .on("mouseenter", () => (this.$refs["book-info-dialog"].$el.style.display = "block"))
      //   .on("mousemove", (ev) => {
      //     this.$refs["book-info-dialog"].$el.style.left = ev.clientX + 10 + "px";
      //     this.$refs["book-info-dialog"].$el.style.top = ev.clientY + 30 + "px";
      //   })
      //   .on("mouseenter", (ev, data) => {
      //     ev.target.style.background = "#da9f21";
      //     this.$refs["book-info-dialog"].$el.style.display = "block";
      //     this.hover_data = {
      //       id: data.名录ID,
      //       title: this.$store.state.allData.find((elem) => elem.id == data.名录ID).content.split("　")[0],
      //       detail: this.$store.state.allData.find((elem) => elem.id == data.名录ID).detail,
      //     };
      //   })
      //   .on("mouseleave", (ev) => {
      //     ev.target.style.background = "#4a330066";
      //     this.$refs["book-info-dialog"].$el.style.display = "none";
      //   });
    });
  },
};
</script>

<style lang="less" scoped>
.book-detail {
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
        font-family: "SourceHanSerif";
        font-weight: bold;
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
      .related-books {
        font-size: 0.8rem;
        position: relative;
        width: 500px;
        height: 300px;
        overflow-y: scroll;
      }
      .person {
        position: absolute;
        right: 100px;
        bottom: 100px;
        table {
          font-size: 0.8rem;
          tr {
            td {
              a {
                color: #000;
              }
            }
          }
        }
      }
    }
  }
}
</style>
