<template>
  <div class="exploration-stack">
    <div class="col-1">
      <div class="batch-buttons">
        <button
          v-for="(batch, index) in batchInfo"
          :key="index"
          v-text="batch.name"
          @click="updateBatch(index)"
        ></button>
      </div>
    </div>
    <div class="col-2">
      <h1 v-if="current_batch == 0">國家珍貴古籍名錄</h1>
      <h1
        v-else
        v-text="`國家珍貴古籍名錄 第${batchInfo[current_batch].name}批`"
      ></h1>
      <div class="featured-books">
        <h3>特色古籍</h3>
        <div class="content">
          <BookItem
            v-for="b in batchInfo[current_batch].featured_books"
            :key="b"
            :id="b"
          />
        </div>
      </div>
      <p
        class="batch-description"
        v-text="batchInfo[current_batch].description"
      ></p>
    </div>
    <div class="col-3">
      <div class="chart-wrapper document-types">
        <BarChart
          title="文獻類型"
          :canvasWidth="500"
          :canvasHeight="150"
          :info="statistics.document_type"
          ref="document_type"
        />
      </div>
      <div class="chart-wrapper edition-types">
        <BarChart
          title="版本朝代"
          :canvasWidth="500"
          :canvasHeight="150"
          :info="statistics.edition_dynasty"
          ref="edition_dynasty"
        />
      </div>
    </div>
    <!-- <BatchInfo :display="showBatchInfo" rel="batch-info" /> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
// import Stack from "@/components/Stack.vue";
import BarChart from "@/components/BarChart.vue";
import BookItem from "@/components/BookItem.vue";
import axios from "axios";

export default {
  name: "Exploration-Stream",
  components: {
    // Stack,
    BookItem,
    BarChart,
  },
  data() {
    return {
      batchInfo: [
        {
          name: "全部批次",
          description:
            "《国家珍贵古籍名录》是由国务院批准发布的我国现存珍贵古籍目录。\n\n2007年，国务院办公厅发布《关于进一步加强古籍保护工作的意见》，启动了“中华古籍保护计划”。其中一项重要任务，就是建立《国家珍贵古籍名录》，实现国家对古籍的分级管理和保护，目的是要建立完备的珍贵古籍档案，确保珍贵古籍的安全。入选典籍为国内存世古籍中具有代表性的精品，且在《国家珍贵古籍名录》评审过程中，一些珍贵古籍的新品种、新版本、新价值被陆续发现。",
          featured_books: [
            "00118",
            "00444",
            "00840",
            "01928",
            "01489",
            "00006",
          ],
        },
        {
          name: "一",
          description:
            "第一批《珍贵古籍名录》收入2392部古籍，其中，汉文古籍2282部，包括简帛117种，敦煌遗书72件、古籍2093部，少数民族古籍110部，包括焉耆-龟兹文、于阗文、藏文、回鹘文、西夏文、白文、蒙古文、察合台文、彝文、满文、东巴文、傣文、水文、古壮字等14种文字。特色古籍有：《大般若波罗蜜多经》六百卷等开宝藏、《资治通鉴》465字残稿、《赵城金藏》、《永乐大典》和《四库全书》。",
          featured_books: [
            "00118",
            "00444",
            "00840",
            "01928",
            "01489",
            "00006",
          ],
        },
        {
          name: "二",
          description:
            "第二批《珍贵古籍名录》收入4478部古籍，其中，汉文古籍2282部，包括简帛117种，敦煌遗书72件、古籍2093部，少数民族古籍110部，包括焉耆-龟兹文、于阗文、藏文、回鹘文、西夏文、白文、蒙古文、察合台文、彝文、满文、东巴文、傣文、水文、古壮字等14种文字。特色古籍有：《大般若波罗蜜多经》六百卷等开宝藏、《资治通鉴》465字残稿、《赵城金藏》、《永乐大典》和《四库全书》。",
          featured_books: [
            "00118",
            "00444",
            "00840",
            "01928",
            "01489",
            "00006",
          ],
        },
        {
          name: "三",
          description:
            "第三批《珍贵古籍名录》收入2989部古籍，其中，汉文古籍2282部，包括简帛117种，敦煌遗书72件、古籍2093部，少数民族古籍110部，包括焉耆-龟兹文、于阗文、藏文、回鹘文、西夏文、白文、蒙古文、察合台文、彝文、满文、东巴文、傣文、水文、古壮字等14种文字。特色古籍有：《大般若波罗蜜多经》六百卷等开宝藏、《资治通鉴》465字残稿、《赵城金藏》、《永乐大典》和《四库全书》。",
          featured_books: [
            "00118",
            "00444",
            "00840",
            "01928",
            "01489",
            "00006",
          ],
        },
        {
          name: "四",
          description:
            "第四批《珍贵古籍名录》收入1516部古籍，其中，汉文古籍2282部，包括简帛117种，敦煌遗书72件、古籍2093部，少数民族古籍110部，包括焉耆-龟兹文、于阗文、藏文、回鹘文、西夏文、白文、蒙古文、察合台文、彝文、满文、东巴文、傣文、水文、古壮字等14种文字。特色古籍有：《大般若波罗蜜多经》六百卷等开宝藏、《资治通鉴》465字残稿、《赵城金藏》、《永乐大典》和《四库全书》。",
          featured_books: [
            "00118",
            "00444",
            "00840",
            "01928",
            "01489",
            "00006",
          ],
        },
        {
          name: "五",
          description:
            "第五批《珍贵古籍名录》收入2392部古籍，其中，汉文古籍2282部，包括简帛117种，敦煌遗书72件、古籍2093部，少数民族古籍110部，包括焉耆-龟兹文、于阗文、藏文、回鹘文、西夏文、白文、蒙古文、察合台文、彝文、满文、东巴文、傣文、水文、古壮字等14种文字。特色古籍有：《大般若波罗蜜多经》六百卷等开宝藏、《资治通鉴》465字残稿、《赵城金藏》、《永乐大典》和《四库全书》。",
          featured_books: [
            "00118",
            "00444",
            "00840",
            "01928",
            "01489",
            "00006",
          ],
        },
        {
          name: "六",
          description:
            "第六批《珍贵古籍名录》收入752部古籍，其中，汉文古籍2282部，包括简帛117种，敦煌遗书72件、古籍2093部，少数民族古籍110部，包括焉耆-龟兹文、于阗文、藏文、回鹘文、西夏文、白文、蒙古文、察合台文、彝文、满文、东巴文、傣文、水文、古壮字等14种文字。特色古籍有：《大般若波罗蜜多经》六百卷等开宝藏、《资治通鉴》465字残稿、《赵城金藏》、《永乐大典》和《四库全书》。",
          featured_books: [
            "00118",
            "00444",
            "00840",
            "01928",
            "01489",
            "00006",
          ],
        },
      ],
      current_batch: 0,
      statistics: {
        document_type: [],
        edition_dynasty: [],
      },
    };
  },
  computed: {
    ...mapState(["rem"]),
  },
  methods: {
    toWidth(p) {
      return window.innerWidth * p;
    },
    toHeight(p) {
      return window.innerHeight * p;
    },
    updateBatch(index) {
      this.current_batch = index;
      for (let n in this.statistics)
        axios
          .get(`/data/batch-data?batch=${this.current_batch}&attr=${n}`)
          .then((d) => (this.statistics[n] = d.data));
    },
  },
  mounted() {
    for (let n in this.statistics)
      axios
        .get(`/data/batch-data?batch=${this.current_batch}&attr=${n}`)
        .then((d) => {
          this.statistics[n] = d.data;
        });
  },
};
</script>

<style lang="less" scoped>
.exploration-stack {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  .col-1 {
    flex: auto 1 1;
  }
  .col-2 {
    flex: 100px 1 1;
    .featured-books {
      .content {
        display: flex;
        flex-wrap: wrap;
        .book-item {
          flex: 30% 1 1;
          margin: 0.2rem;
        }
      }
    }
    .batch-description {
      font-size: 0.7rem;
    }
  }
  .col-3 {
    flex: 100px 1 1;
    .chart-wrapper {
      position: relative;
    }
  }
  .batch-buttons {
    position: absolute;
    top: 50%;
    left: 5rem;
    transform: translateY(-50%);
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
    button:hover {
      background: #000;
      color: #fff;
    }
  }
  .stack {
    position: absolute;
    left: 20vw;
    top: 10vh;
  }
}
</style>
