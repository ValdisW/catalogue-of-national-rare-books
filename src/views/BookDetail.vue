<template>
  <div class="book-detail" v-show="show">
    <div class="content">
      <div class="close-button" @click="close"></div>
      <div class="info">
        <div class="title">
          <span v-text="this.book_data.name"></span>
        </div>
        <div class="switch">
          <button
            class="book-content"
            ref="switch-detail"
            @click="this.show_attrs = false"
          >
            字段顯示
          </button>
          <div>│</div>
          <button
            class="book-display"
            ref="switch-content"
            @click="this.show_attrs = true"
          >
            名錄内容
          </button>
        </div>

        <transition name="fade">
          <div class="detail" v-show="show_attrs">
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
              <p>館藏：</p>
              <p>索書號：</p>
            </div>
            <div class="detail-content">
              <p
                class="language"
                v-text="
                  id2name(
                    this.$store.state.all_language,
                    book_data.language_id,
                    '-'
                  )
                "
              ></p>
              <p
                class="document-type"
                v-text="
                  id2name(
                    this.$store.state.all_document_type,
                    book_data.document_type_id,
                    '-'
                  )
                "
              ></p>
              <p
                class="edition-type"
                v-text="
                  id2name(
                    this.$store.state.all_document_type,
                    book_data.edition_type_id,
                    '-'
                  )
                "
              ></p>
              <p class="edition" v-text="book_data.edition || '-'"></p>
              <p
                class="quantity"
                v-text="book_data.quantity + book_data.measurement || '-'"
              ></p>
              <p class="frame-size" v-text="book_data.frame_size || '-'"></p>
              <p class="typeset" v-text="book_data.typeset || '-'"></p>
              <p class="binding-form">-</p>
              <p class="book-size" v-text="book_data.book_size || '-'"></p>
              <p class="note">-</p>
              <p
                class="institute"
                v-text="
                  id2name(
                    this.$store.state.all_institution,
                    book_data.institution_id,
                    '-'
                  )
                "
              ></p>
              <p v-text="book_data.call_number || '-'"></p>
            </div>
          </div>
        </transition>

        <transition name="fade">
          <div class="display" v-show="!show_attrs">
            <p v-text="book_data.content_sc"></p>
            <p v-text="book_data.content_tc"></p>
            <p v-text="book_data.content_full"></p>
          </div>
        </transition>

        <!-- 责任者 -->
        <ul class="timeline">
          <li v-for="person in related_person" :key="person">
            <div class="actions" v-text="person.action"></div>
            <b></b>
            <div
              class="timestamp"
              v-text="`[${person.dynasty_or_nation}]${person.person}`"
            ></div>
          </li>
        </ul>
      </div>

      <!-- 书影 -->
      <div class="book-image">
        <div class="img-wrapper" @click="openImageViewer">
          <img :src="image_filenames[image_showed_index]" />
        </div>
        <div class="switch_pic" style="text-align: center">
          <button
            v-for="(u, i) in image_filenames"
            :class="{ active: i == image_showed_index }"
            :key="u"
            @click="switchImage(i)"
          ></button>
        </div>
      </div>
    </div>
    <ImageViewer
      ref="image-viewer"
      :imageUrl="image_filenames[image_showed_index]"
    />
  </div>
</template>

<script>
import axios from "axios";
import ImageViewer from "@/components/ImageViewer";
import { id2name } from "@/utils/id2name.js";

export default {
  name: "BookDetail",
  components: { ImageViewer },
  data() {
    return {
      show: false,
      bookID: "",
      image_filenames: ["/images/placeholder.jpg", "/images/placeholder2.jpg"],
      image_showed_index: 0,
      show_attrs: false,
      book_data: { content: "" },
      related_person: [],
      seals: [],
    };
  },
  methods: {
    id2name,
    close() {
      this.show = false;
    },
    open(book_id) {
      this.bookID = book_id;
      this.show = true;

      this.book_data = this.$store.state.books.find((ele) => ele.id == book_id);

      axios.get(`/data/book-detail/${book_id}`).then((d) => {
        this.related_person = d.data[0];
        this.seals = d.data[1];
      });
    },
    openImageViewer() {
      this.$refs["image-viewer"].open();
    },
    // closeImageViewer() {
    //   this.$refs["image-viewer"].close();
    // },
    switchImage(index) {
      this.image_showed_index = index;
    },
  },
  computed: {
    normalized_title() {
      // 临时规范题名
      return this.book_data.content.split("　")[0];
    },
  },
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.book-detail {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  position: fixed;
  top: 0;
  left: 0;
  background: #f2e0c4;

  .content {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    .close-button {
      width: 1rem;
      height: 1rem;
      background: red;
      cursor: pointer;
    }
    .display {
      // height: 80vh;
      font-size: 0.7rem;
      margin-top: 5vh;
      p {
        margin: 0.7rem 0;
      }
    }
    .book-image {
      width: 45%;
      height: 75vh;
      align-items: center;
      justify-content: center;
      .switch_pic {
        display: block;
        margin: 0 auto;
        button {
          margin: 8px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 1px solid #42230f;
          background: transparent;
          cursor: pointer;
        }
        button.active {
          background: #42230f;
        }
      }

      .img-wrapper {
        background: #dec4a4;
        height: 60vh;
        margin: 1rem 0 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          margin: 0 auto;
          display: block;
          height: 60vh;
          transition: all 1s ease-in-out;
          max-width: 100%;
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
          white-space: nowrap;
        }
      }
      .detail {
        display: flex;
        font-size: 0.8rem;
        div {
          line-height: 1.6rem;
        }
        .detail-title {
          text-align: right;
          font-weight: bold;
          margin: 0 0.5rem 0 0;
          flex: auto 0 0;
        }
      }
      // .related-books {
      //   font-size: 0.8rem;
      //   position: relative;
      //   width: 500px;
      //   height: 300px;
      //   overflow-y: scroll;
      // }
      // .person {
      //   position: absolute;
      //   right: 100px;
      //   bottom: 100px;
      //   table {
      //     font-size: 0.8rem;
      //     tr {
      //       td {
      //         a {
      //           color: #000;
      //         }
      //       }
      //     }
      //   }
      // }

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
        content: "";
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
    }
    z-index: 1;
    position: absolute;
  }
}
</style>
