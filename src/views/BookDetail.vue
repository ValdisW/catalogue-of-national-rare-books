<template>
  <div class="book-detail" v-show="show">
    <div class="content">
      <div class="close-button" @click="close"></div>
      <div class="info">
        <div class="title">
          <span v-text="this.book_data.name"></span>
        </div>

        <table class="detail">
          <tr>
            <td class="detail-title">名録號：</td>
            <td class="detail-content document-type" v-text="book_data.id"></td>
          </tr>
          <tr>
            <td class="detail-title">文獻類型：</td>
            <td
              class="detail-content document-type"
              v-text="
                id2name(
                  this.$store.state.all_document_type,
                  book_data.document_type_id,
                  '-'
                )
              "
            ></td>
          </tr>
          <tr>
            <td class="detail-title">文種：</td>
            <td
              class="detail-content language"
              v-text="
                id2name(
                  this.$store.state.all_language,
                  book_data.language_id,
                  '-'
                )
              "
            ></td>
          </tr>
          <tr>
            <td class="detail-title">分類：</td>
            <td
              class="detail-content name"
              v-text="
                id2name(
                  this.$store.state.all_catalogue,
                  book_data.catalogue_id,
                  '-'
                )
              "
            ></td>
          </tr>
          <tr>
            <td class="detail-title">题名：</td>
            <td class="detail-content name" v-text="book_data.name || '-'"></td>
          </tr>
          <!-- <tr>
            <td class="detail-title">版本類型：</td>
            <td
              class="detail-content edition-type"
              v-text="id2name(this.$store.state.all_document_type, book_data.edition_type_id, '-')"
            ></td>
          </tr> -->
          <tr>
            <td class="detail-title">版本：</td>
            <td
              class="detail-content edition"
              v-text="book_data.edition || '-'"
            ></td>
          </tr>
          <tr>
            <td class="detail-title">數量：</td>
            <td
              class="detail-content quantity"
              v-text="book_data.quantity + book_data.measurement || '-'"
            ></td>
          </tr>
          <tr>
            <td class="detail-title">裝幀形式：</td>
            <td class="detail-content binding-form">-</td>
          </tr>
          <tr>
            <td class="detail-title">開本尺寸：</td>
            <td
              class="detail-content book-size"
              v-text="book_data.book_size || '-'"
            ></td>
          </tr>
          <tr>
            <td class="detail-title">板框尺寸：</td>
            <td
              class="detail-content frame-size"
              v-text="book_data.frame_size || '-'"
            ></td>
          </tr>
          <tr>
            <td class="detail-title">版式：</td>
            <td
              class="detail-content typeset"
              v-text="book_data.typeset || '-'"
            ></td>
          </tr>
          <tr>
            <td class="detail-title">牌記：</td>
            <td class="detail-content note">-</td>
          </tr>
          <tr>
            <td class="detail-title">收藏省份：</td>
            <td
              class="detail-content institute"
              v-text="
                id2name(
                  this.$store.state.all_province,
                  book_data.province_id,
                  '-'
                )
              "
            ></td>
          </tr>
          <tr>
            <td class="detail-title">收藏單位：</td>
            <td
              class="detail-content institute"
              v-text="
                id2name(
                  this.$store.state.all_institution,
                  book_data.institution_id,
                  '-'
                )
              "
            ></td>
          </tr>
          <tr>
            <td class="detail-title">索書號：</td>
            <td
              class="detail-content"
              v-text="book_data.call_number || '-'"
            ></td>
          </tr>
        </table>

        <!-- 责任者 -->
        <ul class="timeline">
          <li v-for="person in related_person" :key="person">
            <div
              class="actions"
              v-text="
                id2name($store.state.all_action, person.action_id, '未知行爲')
              "
            ></div>
            <b></b>
            <span
              class="person"
              v-if="
                id2name($store.state.persons, person.person_id, '□□') == '□□'
              "
              v-text="`[${person.dynasty_or_nation}]佚名`"
            ></span>
            <span
              v-else
              @click="$emit('openPersonDetail', person.person_id)"
              class="person"
              v-text="
                `[${person.dynasty_or_nation}]${id2name(
                  $store.state.persons,
                  person.person_id,
                  '佚名'
                )}`
              "
            >
            </span>
          </li>
        </ul>
      </div>

      <!-- 书影 -->
      <div class="book-image">
        <div class="img-wrapper" @click="openImageViewer">
          <img
            :src="image_filenames[image_showed_index]"
            :alt="image_filenames[image_showed_index]"
          />
        </div>

        <div class="switch_pic" style="text-align: center">
          <button
            v-for="(u, i) in image_filenames"
            :class="{ active: i == image_showed_index }"
            :key="u"
            @click="switchImage(i)"
          ></button>
        </div>

        <div class="display">
          <div>
            <p v-text="book_data.content_sc"></p>
          </div>
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
      image_filenames: [],
      image_showed_index: 0,
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
      this.image_filenames = [];
      this.show = true;

      axios.get(`/data/book-detail/${book_id}`).then((d) => {
        this.book_data = d.data[0][0];
        this.related_person = d.data[1];
        this.seals = d.data[2];

        let img_res = this.$store.state.all_image.filter(
          (el) => el.id == book_id
        );
        if (img_res && img_res[0].filename) {
          console.log(this.book_data.batch, img_res[0].filename);
          for (let e of img_res) {
            this.image_filenames.push(`/data/images/${e.folder}/${e.filename}`);
          }
        }
      });
    },
    openImageViewer() {
      this.$refs["image-viewer"].open();
    },
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
  background: #f0e9dd;

  .content {
    width: 80%;
    display: flex;
    justify-content: center;

    .close-button {
      position: absolute;
      left: 0;
      top: 0.5rem;
      width: 2rem;
      height: 2rem;
      background: url(../assets/icons/back.svg) center no-repeat;
      background-size: 100%;
      cursor: pointer;
    }

    .display {
      font-size: 0.7rem;
      margin-top: 5vh;
      div {
        p {
          height: 4rem;
          overflow-y: hidden;
        }
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
          margin: 0.4rem;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          border: 0.05rem solid #42230f;
          background: transparent;
          cursor: pointer;
        }

        button.active {
          background: #42230f;
        }
      }

      .img-wrapper {
        background: #3331;
        width: 100%;
        height: 60vh;
        margin: 0.5rem 0 0 0;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: 60vh;
          object-fit: contain;
          transition: all 1s ease-in-out;
        }
      }
    }
    .info {
      margin-right: 5vh;
      width: 40%;
      height: 80vh;

      .title {
        text-overflow: ellipsis;
        width: 20rem;
        overflow: hidden;
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
        // display: flex;
        font-size: 0.7rem;

        tr {
          line-height: 1.3rem;
          td:first-child {
            // width: 3.6rem;
          }
        }

        .detail-title {
          width: 3.6rem;
          text-align: right;
          font-weight: bold;
          margin: 0 0.5rem 0 0;
          flex: auto 0 0;
        }

        .detail-content {
          line-height: 1rem;
        }
      }

      .timeline {
        list-style-type: none;
        display: flex;
        max-width: 70%;
        justify-content: center;
        overflow-x: scroll;
        overflow-y: hidden;
        height: 6rem;
        li {
          float: left;
          min-width: 25%;
          max-width: 20%;
          position: relative;
          text-align: center;
          padding-top: 0.5rem;
        }

        .actions {
          text-align: center;
          font-weight: bold;
          font-size: 0.6rem;
          height: 2rem;
          margin-bottom: 0.7rem;
          border-bottom: 0.15rem solid #4f4545;
        }

        .person {
          text-align: center;
          margin: 0.4rem 0 0;
          font-size: 0.6rem;
          color: #333;
          display: block;
          position: absolute;
          width: 100%;
        }
      }

      .timeline li b:before {
        content: "";
        position: absolute;
        top: 2.1rem;
        width: 0.8rem;
        left: 0;
        height: 0.8rem;
        border: 0.1rem solid #9f6666;
        border-radius: 50%;
        background: #ffffff;
        margin-left: 37%;
      }
    }

    z-index: 1;
    position: absolute;
  }
}
</style>
