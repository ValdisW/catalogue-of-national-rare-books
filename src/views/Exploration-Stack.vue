<template>
  <div class="exploration-stack">
    <div class="col-1">
      <div class="batch-buttons">
        <button
          v-for="(batch, index) in batchInfo"
          :key="index"
          v-text="batch.name"
          @click="updateBatch(index)"
          :class="{ all_batches: index == 0 }"
        ></button>
      </div>
    </div>

    <div class="col-2">
      <h1 v-if="current_batch == 0" v-animate="'tempStyle'">國家珍貴古籍名錄</h1>
      <h1 v-else v-text="`國家珍貴古籍名錄 第${batchInfo[current_batch].name}批`"></h1>

      <!-- 批次描述 -->
      <p class="batch-description" v-text="batchInfo[current_batch].description"></p>

      <!-- 特色古籍 -->
      <div class="featured-books">
        <div class="show-more">
          <span class="icon"></span>
          <span @click="showMore">換一組</span>
        </div>
        <transition name="fade">
          <div class="content">
            <BookItem @openBookDetail="openBookDetail" v-for="b in showing_books" :key="b" :id="b" />
          </div>
        </transition>
      </div>
    </div>

    <div class="col-3">
      <div class="chart-wrapper edition-dynasties">
        <BarChart
          title="版本朝代"
          ref="edition_dynasty"
          :canvasWidth="400"
          :canvasHeight="120"
          :info="statistics.edition_dynasty"
        />
      </div>
      <div class="chart-wrapper document-types">
        <BarChart
          title="文獻類型"
          ref="document_type"
          :canvasWidth="400"
          :canvasHeight="150"
          :info="statistics.document_type"
        />
      </div>
      <div class="chart-wrapper edition-types">
        <BarChart
          title="版本類型"
          ref="edition_type"
          :canvasWidth="400"
          :canvasHeight="200"
          :info="statistics.edition_type"
        />
      </div>
      <div class="chart-wrapper languagess">
        <BarChart title="文種" ref="language" :canvasWidth="400" :canvasHeight="400" :info="statistics.language" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BarChart from "@/components/BarChart.vue";
import BookItem from "@/components/BookItem.vue";
import axios from "axios";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

export default {
  name: "Exploration-Stack",
  components: { BookItem, BarChart },
  data() {
    return {
      batchInfo: [
        {
          name: "總覽",
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
      ],
      current_batch: 0,
      statistics: {
        document_type: [],
        edition_dynasty: [],
        edition_type: [],
        language: [],
      },
      showing_books: [],
    };
  },
  computed: {
    ...mapState(["rem"]),
  },
  methods: {
    openBookDetail(id) {
      this.$emit("openBookDetail", id);
    },
    toWidth(p) {
      return window.innerWidth * p;
    },
    toHeight(p) {
      return window.innerHeight * p;
    },
    showMore() {
      let arr =
        this.current_batch == 0
          ? this.$store.state.books
          : this.$store.state.books.filter((el) => el.batch == this.current_batch);

      this.showing_books = [];
      for (let i = 0; i < 6; i++) this.showing_books.push(arr[Math.floor(Math.random() * arr.length)].id);
    },
    updateBatch(index) {
      this.current_batch = index;
      for (let n in this.statistics) {
        axios.get(`/data/batch-data?batch=${this.current_batch}&attr=${n}`).then((d) => {
          this.statistics[n] = d.data;
          this.statistics[n].sort((a, b) => {
            return a - b;
          });
        });
      }
      this.showMore();
    },
  },
  created() {
    this.showMore();
  },
  mounted() {
    for (let n in this.statistics)
      axios.get(`/data/batch-data?batch=${this.current_batch}&attr=${n}`).then((d) => {
        this.statistics[n] = d.data;
      });
  },
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter {
  opacity: 0;
}

@keyframes test {
  from {
    background: red;
  }
  from {
    background: yellow;
  }
}
.tempStyle {
  // transform: scale(1.5);
  // transition: 0.5s;
  animation-name: test;
}
.exploration-stack {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .col-1 {
    flex: 5rem 0 0;
    .batch-buttons {
      // position: absolute;
      // top: 50%;
      // left: 5rem;
      // transform: translateY(-50%);
      button {
        cursor: pointer;
        display: block;
        background: none;
        width: 1.8rem;
        height: 1.8rem;
        line-height: 1.8rem;
        border-radius: 50%;
        border: 1px solid #000;
        text-align: center;
        margin: 0.5rem;
        font-size: 0.8rem;
      }
      button.all_batches {
        border: 1px solid #000;
        width: auto;
        padding: 0 0.5rem;
        border-radius: 0.3rem;
        margin-left: 0rem;
      }
      button:hover {
        background: #000;
        color: #fff;
      }
    }
  }
  .col-2 {
    flex: 20rem 0 0;
    margin: 0 1.2rem 0 0;
    .featured-books {
      .show-more {
        user-select: none;
        font-size: 0.7rem;
        text-align: right;
        .icon {
          display: inline-block;
          width: 0.7rem;
          height: 0.7rem;
          background: url(../assets/icons/show-more.svg) center no-repeat;
          background-size: 100%;
        }
        span {
          cursor: pointer;
        }
      }
      .content {
        display: flex;
        flex-wrap: wrap;
      }
    }
    .batch-description {
      font-size: 0.7rem;
      margin: 1rem 0 0;
    }
  }
  .col-3 {
    flex: auto 0 0;
    height: 70%;
    overflow-y: scroll;
    .chart-wrapper {
      position: relative;
    }
  }

  .stack {
    position: absolute;
    left: 20vw;
    top: 10vh;
  }
}
</style>
