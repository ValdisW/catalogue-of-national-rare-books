<template>
  <div class="book-detail">
    <BackButton />
    <div class="content">
      <div class="info">
        <div class="title">
          <span v-text="normalized_title"></span>
        </div>
        <div class="switch">
          <button class="book-content" ref="switch-detail" v-on:click="switch_content()">名錄内容</button>
          <div>│</div>
          <button class="book-display" ref="switch-content" v-on:click="switch_display()">字段顯示</button>
        </div>
        <div class="display" v-show="isDisplay">
          <p class="document-type" v-text="book_data.content"></p>
        </div>
        <div class="detail" v-show="isDetail">
          <div class="detail-title">
            <p>文種：</p>
            <p>文獻類型：</p>
            <p>版本類型：</p>
            <p>板框尺寸：</p>
            <p>裝幀形式：</p>
            <p>開本尺寸：</p>
            <p>牌記：</p>
            <p>館藏：</p>
            <p>索書號：</p>
          </div>
          <div class="detail-content">
            <p class="language" v-text="book_data.language"></p>
            <p class="document-type" v-text="book_data.document_type"></p>
            <p class="edition-type">-</p>
            <p class="frame-size">-</p>
            <p class="binding-form">-</p>
            <p class="book-size">-</p>
            <p class="note">-</p>
            <p class="institute" v-text="book_data.institution"></p>
            <p v-text="book_data.call_number"></p>
          </div>
        </div>
      </div>

      <!-- 书影 -->
      <div class="book-image">
        <div class="switch_pic" style="text-align: center">
          <button class="firstBtn" ref="firstBtn" v-on:click="switch_first()"></button>
          <button class="secondBtn" ref="secondBtn" v-on:click="switch_second()"></button>
        </div>
        <div class="img-wrapper">
          <img class="img-1" v-show="firstPic" src="@/assets/placeholder.jpg" alt="" />
          <!--  test the width-->
          <img
            class="img-2"
            v-show="secPic"
            src="https://file.szmuseum.com/ThumbCover/%E5%8F%A4%E7%B1%8D%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86/201806141352095MD1WD.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
    <BookInfoDialog ref="book-info-dialog" :id="hover_data.id" :title="hover_data.title" :detail="hover_data.detail" />
    <ImageViewer ref="image-viewer" @remove="closeImageViewer" />
  </div>
</template>

<script>
import axios from "axios";
// import * as d3 from "d3";
import BookInfoDialog from "@/components/BookInfoDialog";
import BackButton from "@/components/BackButton";
import ImageViewer from "@/components/ImageViewer";

export default {
  name: "BookDetail",
  components: { BookInfoDialog, BackButton, ImageViewer },
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
    openImageViewer() {
      this.$refs["image-viewer"].open();
    },
    closeImageViewer() {
      console.log(this.$refs["image-viewer"]);
      this.$refs["image-viewer"].close();
    },
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

    switch_first() {
      this.firstPic = true;
      this.secPic = false;
      this.$refs["firstBtn"].style.background = "#42230f";
      this.$refs["secondBtn"].style.background = "transparent";
    },

    switch_second() {
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
    .book-image {
      width: 45%;
      height: 75vh;
      align-items: center;
      justify-content: center;
      .switch_pic {
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
        height: 60vh;
        margin: 1rem 0 0 0;
        img {
          height: 60vh;
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
        display: flex;
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
