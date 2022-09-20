<template>
  <div class="institution-detail" v-show="show">
    <!-- <BackButton /> -->
    <div class="content">
      <div class="intro">
        <h1 v-text="institutionID"></h1>
        <p>
          国家图书馆前身是筹建于1909年9月9日的京师图书馆，1998年更名为国家图书馆。该馆收藏古籍200万册件，其中善本古籍27万册件。宋元善本、敦煌遗书、赵城金藏、永乐大典、四库全书、方志家谱等是其特色藏品，另有金石拓片、舆图、少数民族语文等特藏古籍。专用古籍书库5个，总面积8493平方米。
          由古籍馆全面管理，工作人员130余人，专设典藏阅览、文献保护、古籍特藏修复等机构管理、保护、修复古籍。
        </p>
      </div>
      <ul class="books">
        <li v-for="t in books" :key="t">
          <span
            v-text="t.id + ' ' + t.content"
            @click="$emit('openBookDetail', t.id)"
          ></span>
        </li>
      </ul>
      <div class="statistics"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import axios from "axios";

export default {
  name: "InstitutionDetail",
  props: {
    institutionID: String,
  },
  data() {
    return {
      show: false,
      books: [],
      batches: [[], [], [], [], [], []],
    };
  },
  methods: {
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
  },
  mounted() {
    axios.get(`/data/institution-detail/${this.institutionID}`).then((d) => {
      this.books = d.data;
      this.books.forEach((e) => {
        this.batches[e.batch - 1].push(e);
      });

      let statistics_chart = d3
        .select(".statistics")
        .append("svg")
        .attr("width", "350");

      let batches_data = [];
      this.batches.forEach((e) => {
        batches_data.push(e.length);
      });

      const xScale = d3.scaleLinear([0, d3.max(batches_data)], [30, 300]); // x轴的数值和渲染范围
      const yScale = d3
        .scaleBand(
          new d3.InternSet(d3.map(batches_data, (d, i) => i)),
          [10, 100]
        )
        .padding(0.1);
      const xAxis = d3.axisTop(xScale).ticks(5);
      const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

      statistics_chart
        .append("g")
        .attr("transform", `translate(0,${20})`)
        .call(xAxis)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("y2", 100)
            .attr("stroke-opacity", 0.1)
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", 100)
            .attr("y", -22)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text("xLabel")
        );

      statistics_chart
        .append("g")
        .attr("transform", `translate(${30},0)`)
        .call(yAxis);

      statistics_chart
        .append("g")
        .attr("fill", "#333")
        .selectAll("rect")
        .data(batches_data)
        .join("rect")
        .attr("x", xScale(0))
        .attr("y", (d, i) => {
          return yScale(i);
        })
        .attr("width", (d) => {
          return xScale(d) - xScale(0);
        })
        .attr("height", yScale.bandwidth());
    });
  },
};
</script>

<style lang="less" scoped>
.institution-detail {
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
    flex-direction: column;
    .intro {
      flex: 1 1 20%;
      p {
        font-size: 0.7rem;
      }
    }
    .books {
      max-height: 50vh;
      overflow-y: scroll;
      list-style-type: none;
      font-size: 0.7rem;
      color: rgb(86, 59, 28);
      background: #3333;
      li {
        a {
          color: #000;
        }
      }
    }
  }
}
</style>
