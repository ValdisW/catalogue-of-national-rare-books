<script lang="ts" setup>
import { ref } from "vue";
import { getBookDetailData } from "@/api";
import type { Book, Relation } from "#/axios";
import ImageViewer from "@/components/ImageViewer.vue";

const ImageViewerRef = ref<InstanceType<typeof ImageViewer> | null>(null);

const show = ref(false);
const image_filenames = ref<string[]>([]); // 书影图片
const image_showed_index = ref(0);
const book_data = ref<Book>({ content: "" });
const related_person = ref<Relation[]>([]);
const images = ref([]);

const emit = defineEmits(["startLoading", "endLoading", "openPersonDetail"]);

function clickPerson(id: string) {
  if (id != "P000000") emit("openPersonDetail", id);
}

function close() {
  show.value = false;
}

// 控制古籍详情的显示和更新
function open(book_id: string) {
  image_filenames.value = [];
  show.value = true;

  // 获取书影数据
  getBookDetailData(book_id).then((d) => {
    book_data.value = d.data[0][0]; // 古籍详情数据
    related_person.value = d.data[1]; // 相关人物数据
    images.value = d.data[2]; // 书影数据

    if (images.value && images.value[0].filename && images.value[0].allowed)
      for (let e of images.value) image_filenames.value.push(`/data/images/${e.folder}/${e.filename}`);
    else image_filenames.value[0] = "none";
  });
}
function showDefaultImg(e: Event) {
  (e.target as HTMLImageElement).src = "/data/images/placeholder.jpg";
}

function openImageViewer() {
  ImageViewerRef.value!.open();
}
function switchImage(index: number) {
  image_showed_index.value = index;
}

// onMounted(() => {
//   show.value = true;
//   emit("endLoading");
// });

// onUnmounted(() => {
//   emit("startLoading");
// });

defineExpose({
  show,
  open,
  close,
});
</script>

<template>
  <div class="book-detail" v-show="show">
    <div class="content">
      <div class="close-button" @click="close"></div>
      <div class="info">
        <div class="title">
          <span v-text="book_data.name" :title="book_data.name"></span>
        </div>

        <table class="detail">
          <tr>
            <td class="detail-title">名録號：</td>
            <td class="detail-content document-type" v-text="book_data.id"></td>
          </tr>
          <tr>
            <td class="detail-title">文獻類型：</td>
            <td class="detail-content document-type" v-text="book_data.document_type"></td>
          </tr>
          <tr>
            <td class="detail-title">文種：</td>
            <td class="detail-content language" v-text="book_data.language"></td>
          </tr>
          <tr>
            <td class="detail-title">分類：</td>
            <td class="detail-content name" v-text="book_data.catalogue"></td>
          </tr>
          <tr>
            <td class="detail-title">題名：</td>
            <td class="detail-content name" v-text="book_data.name || '-'"></td>
          </tr>
          <tr>
            <td class="detail-title">版本：</td>
            <td class="detail-content edition" v-text="book_data.edition || '-'"></td>
          </tr>
          <tr>
            <td class="detail-title">數量：</td>
            <td class="detail-content quantity" v-text="book_data.quantity || '-' + book_data.measurement || '-'"></td>
          </tr>
          <tr>
            <td class="detail-title">裝幀形式：</td>
            <td class="detail-content binding-form">-</td>
          </tr>
          <tr>
            <td class="detail-title">開本尺寸：</td>
            <td class="detail-content book-size" v-text="book_data.book_size || '-'"></td>
          </tr>
          <tr>
            <td class="detail-title">板框尺寸：</td>
            <td class="detail-content frame-size" v-text="book_data.frame_size || '-'"></td>
          </tr>
          <tr>
            <td class="detail-title">版式：</td>
            <td class="detail-content typeset" v-text="book_data.typeset || '-'"></td>
          </tr>
          <tr>
            <td class="detail-title">牌記：</td>
            <td class="detail-content note">-</td>
          </tr>
          <tr>
            <td class="detail-title">收藏省份：</td>
            <td class="detail-content institute" v-text="book_data.province"></td>
          </tr>
          <tr>
            <td class="detail-title">收藏單位：</td>
            <td class="detail-content institute" v-text="book_data.institution"></td>
          </tr>
          <tr>
            <td class="detail-title">索書號：</td>
            <td class="detail-content" v-text="book_data.call_number || '-'"></td>
          </tr>
        </table>

        <!-- 责任者 -->
        <ul class="timeline">
          <li v-for="person in related_person" :key="person.person_id" @click="clickPerson(person.person_id)">
            <!-- 责任行为名称 -->
            <div class="actions" v-text="person.action_name"></div>

            <!-- 圆点 -->
            <b></b>

            <!-- 责任者名称 -->
            <span class="person" v-if="person.person_name == '□□'" v-text="`[${person.dynasty_or_nation}]佚名`"></span>
            <span
              class="person"
              v-else
              v-text="(person.dynasty_or_nation ? '[' + person.dynasty_or_nation + ']' : '') + person.person_name"
            >
            </span>
          </li>
        </ul>
      </div>

      <!-- 书影 -->
      <div class="book-image">
        <!-- 书影图片 -->
        <div class="img-wrapper" @click="openImageViewer">
          <img
            :src="image_filenames[image_showed_index]"
            :alt="image_filenames[image_showed_index]"
            @error="showDefaultImg"
          />
        </div>

        <!-- 切换书影图片 -->
        <div class="switch_pic" style="text-align: center">
          <button
            v-for="(u, i) in image_filenames"
            :class="{ active: i == image_showed_index }"
            :key="u"
            @click="switchImage(i)"
          ></button>
        </div>

        <!-- 名录内容 -->
        <div class="display">
          <div>
            <p v-text="book_data.content_sc"></p>
          </div>
        </div>
      </div>
    </div>
    <ImageViewer ref="ImageViewerRef" :imageUrl="image_filenames[image_showed_index]" />
  </div>
</template>

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
      top: 0.15rem;
      width: 2rem;
      height: 2rem;
      background: url(../../assets/icons/back.svg) center no-repeat;
      background-size: 100%;
      cursor: pointer;
    }

    .display {
      font-size: 0.7rem;
      margin-top: 5vh;
      div {
        ::-webkit-scrollbar {
          width: 0.4rem;
        }
        p {
          max-height: 4rem;
          overflow-y: scroll;
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
          border: 0.07rem solid rgba(0, 0, 0, 0.632);
          background: transparent;
          box-sizing: border-box;
          cursor: pointer;
        }

        button.active {
          background: rgba(0, 0, 0, 0.632);
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
      // display: flex;
      // flex-direction: column;
      // justify-content: space-between;

      .title {
        text-overflow: ellipsis;
        width: 20rem;
        overflow: hidden;
        font-family: "SourceHanSerif";
        font-weight: bold;
        font-size: 1.6rem;
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
      ::-webkit-scrollbar {
        height: 0.4rem;
      }
      .timeline {
        list-style-type: none;
        display: flex;
        max-width: 70%;
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
          cursor: pointer;
          &:hover {
            background: #00000012;
          }
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
