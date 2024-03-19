<script lang="ts" setup>
import { ref, reactive, computed, inject } from "vue";
import { useStore } from "@/store";

import type { Relation } from "@/types";

// import { mapState } from "vuex";
import BarChart from "@/components/introduction/BarChart.vue";
import BookItem from "@/components/introduction/BookItem.vue";
import sta from "@/data/statistics.json";
import { readData } from "@/store/idb";

const changeKey = ref(0);
const emit = defineEmits(["openBookDetail"]);
const store = useStore();

const batchInfo = [
  {
    name: "總",
    description:
      "《國家珍貴古籍名録》是由中華人民共和國國務院批准公布的我國現存珍貴古籍目録。建立《國家珍貴古籍名録》是確保珍貴古籍安全、推動古籍保護工作、促進優秀傳統文化傳承和弘揚的重要舉措。目前，國務院已批准公布六批《國家珍貴古籍名録》，全國485家機構/個人收藏的13026部古籍入選，囊括先秦兩漢至明清時期的漢文古籍、少數民族文字古籍和其他文字古籍，其中漢文文獻11855部（含甲骨4種，簡帛187種，敦煌遺書405件，碑帖拓本219件，古地圖149件，漢文古籍10891部），少數民族文字古籍1133部，其他文字古籍38部。",
  },
  {
    name: "一",
    description:
      "第一批《國家珍貴古籍名録》于2008年3月1日公布，收録210家藏書機構/個人的2392部古籍文獻，其中，漢文文獻2282部，包括簡帛117種、敦煌遺書73件、碑帖拓本73件、古地圖10件、漢文古籍2009部；少數民族文字古籍110部，包括焉耆—龜兹文、于闐文、藏文、回鶻文、西夏文、白文、蒙古文、察合台文、彝文、滿文、東巴文、傣文、水文、古壯字等14種文字。",
  },
  {
    name: "二",
    description:
      "第二批《國家珍貴古籍名録》于2009年6月9日公布，收録280家藏書機構/個人的4478部古籍文獻，其中，漢文文獻4211部，包括簡帛9種、敦煌遺書146件、碑帖拓本10件、古地圖13件、漢文古籍4033部；少數民族文字古籍266部，包括藏文、回鶻文、西夏文、蒙古文、察合台文、彝文、滿文、東巴文、傣文、水文、古壯字、布依文等12種文字；其他文字古籍1部。",
  },
  {
    name: "三",
    description:
      "第三批《國家珍貴古籍名録》于2010年6月11日公布，收録239家藏書機構/個人的2989部古籍文獻，其中，漢文文獻2741部，包括敦煌遺書101件、碑帖拓本10件、古地圖52件、漢文古籍2578部；少數民族文字古籍246部，包括于闐文、粟特文、藏文、西夏文、蒙古文、察合台文、彝文、滿文、東巴文、傣文、水文、古壯字、布依文等13種文字；其他文字古籍2部。",
  },
  {
    name: "四",
    description:
      "第四批《國家珍貴古籍名録》于2013年3月8日公布，收録189家藏書機構/個人的1516部古籍文獻，其中，漢文文獻1221部，包括甲骨3種、簡帛25種、敦煌遺書28件、碑帖拓本70件、古地圖42件、漢文古籍1053部；少數民族文字古籍286部，包括藏文、回鶻文、西夏文、蒙古文、察合台文、彝文、滿文、東巴文、傣文、水文、古壯字、布依文等12種文字；其他文字古籍9部。",
  },
  {
    name: "五",
    description:
      "第五批《國家珍貴古籍名録》于2016年3月27日公布，共收録139家藏書機構/個人的899部古籍文獻，其中，漢文文獻754部，包括甲骨1種、簡帛13種、敦煌遺書28件、碑帖拓本22件、古地圖14件、漢文古籍676部；少數民族文字古籍131部，包括藏文、西夏文、蒙古文、察合台文、彝文、滿文、東巴文、水文、古壯字、布依文等10種文字；其他文字古籍14部。",
  },
  {
    name: "六",
    description:
      "第六批《國家珍貴古籍名録》于2020年10月30日公布，共收録119家藏書機構/個人的752部古籍文獻，其中，漢文文獻646部，包括簡帛23種、敦煌遺書29件、碑帖拓本34件、古地圖18件、漢文古籍542部；少數民族文字古籍94部，包括于闐文、藏文、蒙古文、彝文、滿文、東巴文、傣文、水文、古壯字等9種文字；其他文字古籍12部。",
  },
];
const current_batch = ref(0);
const statistics = ref([]);
const showing_books = <Relation[]>reactive([]);
const books = inject("introductionData").value[0];

// const rem = computed(() => {
//   return mapState(["rem"]).rem;
// });

/**
 * 打开古籍详情页，逐级传递古籍id到App.vue
 * @param {*} book_id 古籍id
 */
function openBookDetail(book_id: string) {
  emit("openBookDetail", book_id);
}

function toWidth(p: number) {
  return window.innerWidth * p;
}

function toHeight(p: number) {
  return window.innerHeight * p;
}

/**
 * 从store中随机抽取6本古籍，显示在页面上
 */
async function showMore() {
  changeKey.value++;
  let arr = current_batch.value == 0 ? books : books.filter((el: Relation) => el.batch == current_batch.value); // 随机选择的范围

  for (let i = 0; i < 6; i++) showing_books[i] = arr[Math.floor(Math.random() * arr.length)].id;
}

/**
 * 切换批次
 */
function updateBatch(index: number) {
  current_batch.value = index;
  showMore();
}

showMore();
statistics.value = sta; // 要求统计数据写死，因此直接读取json文件

// 先秦兩漢時期	入選古籍涉及：商、戰國、秦、西漢、東漢
// 魏晋南北朝隋唐五代時期	入選古籍涉及：晋（西晋、東晋）、北凉、西凉、南北朝（南朝梁、南朝陳、北魏、西魏、北齊）、六朝、高昌、隋、唐（武周）、吐蕃統治敦煌時期、歸義軍時期、五代（後梁、後唐、後周）、吴越
// 宋遼夏金元時期	入選古籍涉及：宋（北宋、南宋）、遼、大理國、僞齊、西夏、金、蒙古、元
// 明	入選古籍涉及：明、南明、北元
// 清	入選古籍涉及：清、太平天國
</script>

<template>
  <div class="batches">
    <div class="section-name">
      <span></span>
      <span>批次選擇</span>
      <span></span>
      <span></span>
    </div>
    <div class="container">
      <div class="batch-buttons">
        <button
          v-for="(batch, index) in batchInfo"
          :key="index"
          v-text="batch.name"
          :class="{ selected: current_batch == index }"
          @click="updateBatch(index)"
        ></button>
      </div>

      <div class="content">
        <div class="info">
          <!-- 基本文字介绍 -->
          <div class="col-1">
            <h3 v-if="current_batch == 0">國家珍貴古籍名録</h3>
            <h3 v-else v-text="`國家珍貴古籍名録 第${batchInfo[current_batch].name}批`"></h3>

            <!-- 批次描述 -->
            <p class="batch-description" v-text="batchInfo[current_batch].description"></p>
          </div>

          <!-- 条形图表 -->
          <div class="col-2">
            <div class="left">
              <div class="chart-wrapper document-types">
                <BarChart
                  title="文獻類型"
                  ref="document_type"
                  bar_color="#C4A1A1"
                  :canvasWidth="15 * store.rem!"
                  :canvasHeight="7 * store.rem!"
                  :margin_left="0.46"
                  :info="statistics[current_batch].document_type"
                />
              </div>
              <div class="chart-wrapper edition-dynasties">
                <BarChart
                  title="版本朝代"
                  ref="edition_dynasty"
                  bar_color="#76978F"
                  :canvasWidth="15 * store.rem!"
                  :canvasHeight="5.6 * store.rem!"
                  :margin_left="0.46"
                  :info="statistics[current_batch].edition_dynasty"
                />
              </div>
              <div class="chart-wrapper edition-types">
                <BarChart
                  title="版本類型"
                  ref="edition_type"
                  bar_color="#B1B098"
                  :canvasWidth="15 * store.rem!"
                  :canvasHeight="9.6 * store.rem!"
                  :margin_left="0.46"
                  :info="statistics[current_batch].edition_type"
                />
              </div>
            </div>
            <div class="right">
              <div class="chart-wrapper languagess">
                <BarChart
                  title="文種"
                  ref="language"
                  bar_color="#B0A1B8"
                  :canvasWidth="14 * store.rem!"
                  :canvasHeight="23.7 * store.rem!"
                  :margin_left="0.55"
                  :info="statistics[current_batch].language"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 特色古籍 -->
        <div class="featured-books">
          <div class="show-more">
            <span class="icon"></span>
            <span @click="showMore">换一組</span>
          </div>
          <Transition name="books">
            <div class="book-items" :key="changeKey">
              <BookItem @openBookDetail="openBookDetail" v-for="b in showing_books" :key="b" :id="b" />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.books-enter-active {
  transition: all 0.5s;
}

.books-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.books-leave-active {
  opacity: 0;
}

.batches {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .container {
    width: 90%;
    height: 80%;
    border: 0.1rem solid #201d1d;
    display: flex;
    align-items: center;
    justify-content: center;

    .batch-buttons {
      flex: 5% 0 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-right: 0.05rem solid #201d1d;

      button {
        cursor: pointer;
        outline: none;
        display: block;
        background: none;
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 50%;
        border: none;
        text-align: center;
        margin: 1rem 0;
        font-size: 0.8rem;
        transition: 0.3s;
        &:hover {
          border: 0.15rem solid #c94324;
        }
      }

      button.selected {
        border: 0.15rem solid #c94324;
      }
    }

    .content {
      height: 100%;
      flex: 95% 1 1;
      padding: 0 3% 0 3%;
      display: flex;
      flex-direction: column;

      .info {
        display: flex;
        flex: 70% 0 0;
        padding: 3% 0 0;
        box-sizing: border-box;
        .col-1 {
          flex: 40% 0 0;

          h3 {
            letter-spacing: 0.05rem;
            background: #e2d7cc;
            padding: 0.3rem 0.6rem;
            width: fit-content;
          }

          .batch-description {
            font-size: 0.7rem;
            padding: 1.1rem 3rem 0 0;
            line-height: 1.3rem;
          }
        }

        .col-2 {
          flex: 60% 0 0;
          display: flex;
          height: 100%;

          .chart-wrapper {
            position: relative;
          }

          .left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .right {
          }
        }
      }

      .featured-books {
        flex: 30% 0 1;
        display: flex;
        flex-direction: column;
        .show-more {
          user-select: none;
          font-size: 0.7rem;
          text-align: right;

          .icon {
            display: inline-block;
            width: 0.7rem;
            height: 0.7rem;
            background: url(../../assets/icons/show-more.svg) center no-repeat;
            background-size: 100%;
          }

          span {
            cursor: pointer;
          }
        }

        .book-items {
          display: flex;
          flex: auto 1 1;
        }
      }
    }
  }
}
</style>
