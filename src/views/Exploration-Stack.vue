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
      <h1 v-if="current_batch == 0" v-animate="'tempStyle'">
        國家珍貴古籍名錄
      </h1>
      <h1
        v-else
        v-text="`國家珍貴古籍名錄 第${batchInfo[current_batch].name}批`"
      ></h1>

      <!-- 批次描述 -->
      <p
        class="batch-description"
        v-text="batchInfo[current_batch].description"
      ></p>

      <!-- 特色古籍 -->
      <div class="featured-books">
        <transition name="fade">
          <div class="content">
            <BookItem
              v-for="b in batchInfo[current_batch].featured_books"
              :key="b"
              :id="b"
            />
          </div>
        </transition>
      </div>
    </div>
    <div class="col-3">
      <div class="chart-wrapper document-types">
        <BarChart
          title="文獻類型"
          ref="document_type"
          :canvasWidth="500"
          :canvasHeight="150"
          :info="statistics.document_type"
        />
      </div>
      <div class="chart-wrapper edition-types">
        <BarChart
          title="版本朝代"
          ref="edition_dynasty"
          :canvasWidth="500"
          :canvasHeight="150"
          :info="statistics.edition_dynasty"
        />
      </div>
      <div class="chart-wrapper edition-types">
        <BarChart
          title="版本類型"
          ref="edition_type"
          :canvasWidth="500"
          :canvasHeight="150"
          :info="statistics.edition_type"
        />
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
import "aos/dist/aos.css"; // You can also use <link> for styles

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
            "2008年、2009年、2010年、2013年、2016和2020年，国务院先后公布首批、第二批、第三批、第四批、第五批和第六批《国家珍贵古籍名录》及“全国古籍重点保护单位”名单，入选《国家珍贵古籍名录》的古籍总数达到13036部，其中，汉文古籍共计11865部，少数民族文字古籍共计16个文种1133部，其他文字古籍38部。",
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
            "第一批《国家珍贵古籍名录》收入2392部古籍，其中，汉文古籍2282部，包括简帛117种、敦煌遗书72件、古籍2093部；少数民族文字古籍110部，包括14种文字。\n其中，许多特色古籍是各收藏机构的镇馆之宝。此外，一些由于历史原因分藏两处的珍贵典籍也得以团聚于《名录》。",
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
            "第二批《国家珍贵古籍名录》收入4478部古籍，其中，汉文古籍4211部，包括简帛9种、敦煌遗书146件、古籍4056部；少数民族文字古籍267部，包括12种文字。\n其中，有一些未见于以前著录的善本出现。此外，不仅内地收藏单位，澳门特别行政区也积极参与申报，澳门大学图书馆有3部古籍入选，是澳门地区首批入选《国家珍贵古籍名录》的藏品。",
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
            "第三批《国家珍贵古籍名录》收入2989部古籍，其中，汉文古籍2741部，包括敦煌遗书101件、古籍2640部；少数民族文字古籍246部，包括13种文字；其他文字古籍2部。\n舆图首次成规模参加评审，古代地图能够客观反映我国自古以来辽阔的疆域，有极其重要的历史文献价值。“其他文字珍贵古籍名录”，收录了《节本托勒密天文学大成》和《金言集》两种西文善本。",
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
            "第四批《国家珍贵古籍名录》收入1516部古籍，其中，汉文古籍1221部，包括甲骨文3条、简帛25种、敦煌遗书28件、古籍1165部；少数民族文字古籍186部，包括12种文字。\n其中，甲骨文首次入选。其刻辞内容涉及商代的天文、地理、军事、农业、交通、宗教等多个方面。为加强对甲骨文的保护，共有7家单位收藏的53872片甲骨文首次入选《国家珍贵古籍名录》。\n此外，上海图书馆申报入选的一批碑帖拓本，数量较多，楮墨精良。\n少数民族文字古籍申报愈发踊跃，尤其是藏文古籍。",
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
            "第五批《国家珍贵古籍名录》共收录139家藏书单位的899部古籍文献，囊括汉文古籍754部、少数民族文字古籍131部、其他文字古籍14部。\n简帛文献13种，是近年发现并取得重要研究成果的珍贵典籍，以清华大学藏战国竹简和北京大学藏汉简尤其令人瞩目。入选珍贵拓本22部，其中8部宋元善拓均为香港中文大学中国文化研究所文物馆所藏，系香港地区首次申报，扩大了《国家珍贵古籍名录》的重要影响。",
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
            "第六批《国家珍贵古籍名录》共收录752部古籍文献，囊括汉文古籍646部、少数民族文字古籍94部、其他文字古籍12部。\n清华大学申报入选的战国竹简，均为首次公布的战国佚籍。国家图书馆申报入选的三部早期印刷品《佛说观弥勒菩萨上生兜率天经》、《金刚般若波罗蜜经》、《弥勒下生成佛经》为晚唐五代北宋初木版雕刻，是国内已知有纪年的最早雕版印刷品。",
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
        edition_type: [],
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
      for (let n in this.statistics) {
        axios
          .get(`/data/batch-data?batch=${this.current_batch}&attr=${n}`)
          .then((d) => {
            if (n == "edition_dynasty") {
              this.statistics[n] = d.data;
            } else this.statistics[n] = d.data;
          });
      }
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
      .content {
        display: flex;
        flex-wrap: wrap;
      }
    }
    .batch-description {
      font-size: 0.7rem;
      margin: 1rem 0;
    }
  }
  .col-3 {
    flex: auto 0 0;
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
