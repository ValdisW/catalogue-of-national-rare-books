<template>
  <div class="container"></div>
</template>

<script>
const d3 = require("d3");
// import $ from 'jquery'
import * as Data from "@/data/dataLoader";
import * as Tooltip from "@/utils/Tooltip";
import { mapState } from "vuex";

const margin = {
  left: 0.05,
  right: 0.05,
  top: 0.05,
  bottom: 0.1,
};

const displayOrder = {
  0: "战国",
  1: "秦",
  2: "漢",
  3: "三国",
  4: "魏晋",
  5: "南北朝",
  6: "唐",
  7: "隋",
  8: "五代十国",
  9: "宋",
  10: "元",
  11: "明",
  12: "清",
  13: "其它&未知",
};
const batchKeys = ["第1批", "第2批", "第3批", "第4批", "第5批", "第6批"];
// const fillColor = [
// ]

export default {
  name: "StreamGraph",
  props: ["canvasWidth", "canvasHeight"],
  data() {
    return {};
  },
  computed: {
    ...mapState(["rem"]),
  },
  watch: {
    // for interaction
  },
  methods: {
    initializeDrawingFunction() {
      let self = this;
      self.pathStyle = (path) => {
        path
          .attr("fill", (d, i) => d3.interpolateCool(Math.random(i)))
          .attr("fill-opacity", 0.8)
          .style("cursor", "pointer");
      };
    },
    initializeHoverFunction() {
      this.pathHover = (path) => {
        path
          .on("mouseover", function () {
            d3.select(this)
              .attr("stroke", "gray")
              .attr("stroke-opacity", 0.5)
              // .attr('stroke-width', 2)
              .attr("fill-opacity", 1);
          })
          .on("mouseout", function () {
            d3.select(this).attr("fill-opacity", 0.8).attr("stroke", "none");
          });
      };
    },
    processStack() {
      this.data = Data.get_statics(displayOrder);
      this.stackgen = d3
        .stack()
        .keys(batchKeys)
        .offset(d3.stackOffsetSilhouette)
        .order(d3.stackOrderNone);
      this.layers = this.stackgen(this.data);
      // console.log(this.layers)
    },
    drawTooltip() {
      let get_dynasty = function (event) {
        let min_dis = 1e5;
        let min_t = "";
        let min_pos = 0;
        d3.selectAll("g.tick")._groups[0].forEach((element) => {
          let pos = element.getBoundingClientRect().x;
          let t = d3.select(element).select("text").text();
          let dis = Math.abs(pos - event.x);
          if (dis < min_dis) {
            min_t = t;
            min_dis = dis;
            min_pos = pos;
          }
        });
        let res = {
          朝代: min_t,
          位置: min_pos,
        };
        return res;
      };
      let processFunc = function (e, d) {
        // console.log(e,d);
        let mydata = { 批次: d.key };
        mydata["朝代"] = get_dynasty(e)["朝代"];
        mydata["数量"] = Data.get_batch_dynasty_num(d.key, mydata["朝代"]);
        return mydata;
      };
      let tooltip = Tooltip.Tooltip()
        .extent([
          [0, 0],
          [this.svg.attr("width"), this.svg.attr("height")],
        ])
        .tips(
          ["批次", "朝代", "数量"],
          ["", "朝代: ", "古籍数量: "],
          [null],
          processFunc
        )
        .fontSize(16)
        .padding([8, 4])
        .margin([10, 10]);
      d3.select(this.$el).call(tooltip);
      this.svg.selectAll("path.batchset").each(tooltip.events);
    },
    removeTooltip() {
      d3.select(this.$el).select(".d3Tooltip").remove();
    },
    initializeStreamGraph(width, height) {
      let self = this;

      self.processStack();
      self.initializeDrawingFunction();
      self.initializeHoverFunction();

      d3.select(self.$el).selectAll("svg").remove();
      self.svg = d3
        .select(self.$el)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      self.stream = self.svg
        .append("g")
        .attr("id", "streamgraph")
        .attr(
          "transform",
          `translate(${width * margin.left}, ${height * margin.top})`
        );

      let svgWidth = width * (1 - margin.left - margin.right);
      let svgHeight = height * (1 - margin.top - margin.bottom);

      let x = d3
        .scaleLinear()
        .domain([0, Object.keys(displayOrder).length - 1])
        .range([0, svgWidth]);
      // let x = d3.scaleBand()
      //         .domain(Object.values(displayOrder))
      //         .range([0, svgWidth]);
      let y = d3
        .scaleLinear()
        .domain([
          d3.min(self.layers, (l) => d3.min(l, (d) => d[0])),
          d3.max(self.layers, (l) => d3.max(l, (d) => d[1])),
        ])
        .range([svgHeight, 0]);

      self.area = d3
        .area()
        .x((d, i) => x(i))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))
        .curve(d3.curveCardinal);

      self.removeTooltip();

      self.path = self.stream
        .selectAll("path")
        .data(self.layers)
        .join("path")
        .attr("d", self.area)
        .attr("class", (d) => "batchset " + d.key)
        .call(self.pathStyle)
        .call(self.pathHover);

      // x axis
      let axis_x = d3
        .axisBottom()
        .scale(x)
        .ticks(Object.keys(displayOrder).length)
        .tickFormat((d) => d);

      self.svg
        .append("g")
        .attr("id", "axis")
        .attr(
          "transform",
          `translate(${width * margin.left}, ${
            height * (1 - margin.bottom / 2)
          })`
        )
        .call(axis_x) // 将g作为函数参数调用函数
        .attr("font-size", "1.2rem")
        .selectAll("text")
        .text((d) => displayOrder[d]);

      self.drawTooltip();
    },
  },
  mounted() {
    this.initializeStreamGraph(this.canvasWidth, this.canvasHeight);
  },
};
</script>

<style scoped lang="less">
.container {
  overflow: scroll;
}
</style>
