<template>
  <div class="book-detail">
    <BackButton />
    <div class="content">
      <div class="info">
        <div class="title">
          <!--          <span v-text="$route.params.bookID"></span>-->
          <span v-text="normalized_title"></span>
        </div>
        <div class="switch">
          <button
            class="book-content"
            ref="switch-detail"
            v-on:click="switch_content()"
          >
            名錄内容
          </button>
          <div>│</div>
          <button
            class="book-display"
            ref="switch-content"
            v-on:click="switch_display()"
          >
            字段顯示
          </button>
        </div>
        <div class="display" v-show="isDisplay">
          <p class="document-type" v-text="book_data.content"></p>
        </div>
        <div class="detail" v-show="isDetail">
          <div class="detail-title">
            <p>文種：</p>
            <p>文獻類型：</p>
            <p>版本類型：</p>
            <p>版本：</p>
            <p>數量：</p>
            <p>板框尺寸：</p>
            <p>版式：</p>
            <p>裝幀形式：</p>
            <p>開本尺寸：</p>
            <p>牌記：</p>
            <p style="margin-top: 20px">館藏：</p>
            <p>索書號：</p>
          </div>
          <div class="detail-content">
            <p class="language" v-text="book_data.language"></p>
            <p class="document-type" v-text="book_data.document_type"></p>
            <p class="edition-type" >-</p>
            <p class="edition">-</p>
            <p class="number">-</p>
            <p class="frame-size">-</p>
            <p class="frame-form">-</p>
            <p class="binding-form">-</p>
            <p class="book-size">-</p>
            <p class="note">-</p>
            <p
              class="institute"
              style="margin-top: 20px"
              v-text="book_data.institution"
            ></p>
            <p v-text="book_data.call_number"></p>
          </div>
        </div>
        <!--        <div class="related-books">-->
        <!--          <p-->
        <!--            v-for="b in this.related_books"-->
        <!--            :key="b.名录ID"-->
        <!--            v-text="-->
        <!--              $store.state.allData-->
        <!--                .find((elem) => elem.id == b.名录ID)-->
        <!--                .content.split('　')[0]-->
        <!--            "-->
        <!--          ></p>-->
        <!--        </div>-->
        <!--        <div class="person">-->
        <!--          <table>-->
        <!--            <tr v-for="e in person_data" :key="e">-->
        <!--              <td>-->
        <!--                <router-link-->
        <!--                  v-if="e.责任人姓名"-->
        <!--                  v-text="-->
        <!--                    '[' + (e.dynasty_or_nation || '？') + ']' + e.责任人姓名-->
        <!--                  "-->
        <!--                  :to="'/person-detail/' + e.责任人姓名"-->
        <!--                ></router-link>-->
        <!--                <span-->
        <!--                  v-else-->
        <!--                  v-text="'[' + (e.dynasty_or_nation || '？') + ']佚名'"-->
        <!--                ></span>-->
        <!--              </td>-->
        <!--              <td v-text="e.责任行为"></td>-->
        <!--            </tr>-->
        <!--          </table>-->
        <!--        </div>-->

        <ul class="timeline">
          <li>
            <div class="actions">撰</div>
            <div class="test"></div>
            <b></b>
            <div class="timestamp">[唐]柳宗元</div>
          </li>
          <li>
            <div class="actions">校正</div>
            <b></b>
            <div class="timestamp">[明]廖瑩中</div>
          </li>
          <li>
            <div class="actions">刻</div>
           <b></b>
            <div class="timestamp">[明]佚名</div>
          </li>

        </ul>


      </div>

      <div class="book-image">
        <div class="switch_pic" style="text-align: center">
         <button class="firstBtn" ref="firstBtn" v-on:click="switch_first()"></button>
         <button class="secondBtn" ref="secondBtn"  v-on:click="switch_second()"></button>
        </div>
      <div class="img-wrapper" >
        <img class="img-1" v-show="firstPic" src="@/assets/placeholder.jpg" alt="" />
           <!--  circle the width-->
        <img class="img-2" v-show="secPic" src="https://file.szmuseum.com/ThumbCover/%E5%8F%A4%E7%B1%8D%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86/201806141352095MD1WD.jpg" alt="" />
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
      isDetail: true,
      isDisplay: false,
      firstPic: true,
      secPic: false,
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
  methods: {
    switch_content() {
      this.isDisplay = false;
      this.isContent = true;

      this.$refs["switch-content"].style.color = "#4a3300";
      this.$refs["switch-detail"].style.color = "#8f644d";
    },

    switch_display() {
      this.isDisplay = true;
      this.isContent = false;

      this.$refs["switch-content"].style.color = "#8f644d";
      this.$refs["switch-detail"].style.color = "#4a3300";
    },

    switch_first(){
      this.firstPic = true;
      this.secPic = false;
      this.$refs["firstBtn"].style.background = "#42230f";
      this.$refs["secondBtn"].style.background = "transparent";
    },

    switch_second(){
      this.secPic = true;
      this.firstPic = false;
      this.$refs["firstBtn"].style.background = "transparent";
      this.$refs["secondBtn"].style.background = "#42230f";
    },
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

    .display {
      height: 80vh;
      font-size: 2.3vh;
      margin-top: 5vh;
    }
    .book-image{
      width: 50%;
      height: 80vh;
      align-items: center;
      justify-content: center;
      .switch_pic{
        display: block;
        margin: 0 auto;
        .firstBtn {
          margin: 8px;
          width: 15px;
          height: 15px;
          background: #42230f;
          border-radius: 50%;
          border: 1px solid #42230f;

        }
        .secondBtn {
          margin: 8px;
          width: 15px;
          height: 15px;
          background: transparent;
          border-radius: 50%;
          border: 1px solid #42230f;
        }
      }

      .img-wrapper {
        background: #dec4a4;
        // background: #5e524a;
        height: 75vh;
        margin: 1rem 0 0 0;
        img {
          height: 75vh;
          transition: all 1s ease-in-out;
        }

        .img-1 {
          margin: 0 auto;
          display: block;
        }


        .img-2 {
          margin: 0 auto;
          display: block;

        }
      }
    }


    .info {
      margin-right: 5vh;
      width: 40%;
      height: 80vh;
      .switch {
        display: flex;

        margin-bottom: 10px;

        .book-content {
          color: #8f644d;
          background-color: transparent;
          border-style: none;
          font-size: 2.3vh;
        }
        .book-display {
          color: #4a3300;
          background-color: transparent;
          border-style: none;
          font-size: 2.3vh;
        }
      }

      .timeline {
        list-style-type: none;
        display: flex;
        align-items: center;
        justify-content: center;

        li {
          float: left;
          min-width: 25%;
          max-width: 20%;
          position: relative;
          text-align: center;
          padding-top: 10px;
        }

        .actions {
          text-align: center;
          font-weight: bold;
          font-size: 2.3vh;
          height: 45px;
          margin-bottom: 30px;
          border-bottom: 3px solid #4f4545;
        }


        .timestamp {
          text-align: center;
          margin-top: 20px;
          font-size: 2vh;

        }

      }

      .timeline li b:before {
        content: '';
        position: absolute;
        top: 45px;
        width: 20px;
        left: 0%;
        height: 20px;
        border: 3px solid #9f6666;
        border-radius: 50%;
        background: #ffffff;
        margin-left: 40%;

       }

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
        display: flex;
        line-height: 2;
        .detail-title {
          text-align: right;
          width: 20%;
          font-weight: bold;
        }
        .detail-content{
          margin-left: 25px;
        }
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
