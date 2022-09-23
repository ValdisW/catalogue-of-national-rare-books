<template>
  <div class="bar-chart">
    <div class="title" v-text="title"></div>
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "BarChart",
  props: {
    canvasWidth: Number,
    canvasHeight: Number,
    title: String,
    info: Array,
    bar_color: String,
  },
  data() {
    return {
      // bar_color: "#604a2f",
      margin: {
        left: 0.3,
        right: 0.08,
        top: 0.1,
        bottom: 0.1,
      },
    };
  },
  watch: {
    canvasWidth: function (newVal) {
      this.rescale(newVal, this.canvasWidth);
    },
    canvasHeight: function (newVal) {
      this.rescale(this.canvasWidth, newVal);
    },
    info: function () {
      this.initializeBarchart();
    },
  },
  methods: {
    rescale(width, height) {
      this.initializeBarchart(width, height);
    },
    get_name() {
      let lst = [];
      this.info.forEach((e) => {
        lst.push(e.name);
      });
      return lst;
    },
    initializeBarchart() {
      if (this.info) {
        let svgHeight =
            this.canvasHeight * (1 - this.margin.top - this.margin.bottom),
          svgWidth =
            this.canvasWidth * (1 - this.margin.left - this.margin.right);

        d3.select(this.$refs.chart).selectAll("svg").remove();
        this.svg = d3
          .select(this.$refs.chart)
          .append("svg")
          .attr("width", this.canvasWidth)
          .attr("height", svgHeight);

        let x = d3
          .scaleLinear()
          .domain([0, Math.log(d3.max(this.info, (l) => l.value))])
          .range([0, svgWidth]);
        let y = d3
          .scaleBand()
          .domain(this.get_name())
          .range([0, svgHeight])
          .padding(0.5);

        this.chart = this.svg
          .selectAll("g")
          .data(this.info)
          .join("g")
          .attr("class", (d) => {
            "bar " + d.name;
          })
          .attr(
            "transform",
            (d) =>
              `translate(${this.canvasWidth * this.margin.left},${y(d.name)})`
          );

        // add bar
        this.chart
          .append("g")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", (d) => x(Math.log(d.value + 1)))
          .attr("height", y.bandwidth())
          .attr("fill", this.bar_color)
          .attr("fill-opacity", 0.8);

        this.chart
          .append("g")
          .attr(
            "transform",
            (d) => `translate(${x(Math.log(d.value + 1)) + 3},${y.bandwidth()})`
          )
          .append("text")
          .attr("font-size", "0.6rem")
          .text((d) => d.value);

        // y axis
        let axis_y = d3
          .axisLeft()
          .scale(y)
          .ticks(this.info.length)
          .tickFormat((d) => d);

        this.svg
          .append("g")
          .attr("id", "axis")
          .attr(
            "transform",
            `translate(${this.canvasWidth * this.margin.left}, ${
              svgHeight * 0
            })`
          )
          .call(axis_y) // 将g作为函数参数调用函数
          .attr("font-size", "0.6rem")
          .selectAll("text")
          .text((d) => d);
      }
    },
  },
};
</script>

<style scoped lang="less">
.bar-chart {
  position: relative;

  .title {
    position: absolute;
    left: 0;
    top: 0;
    font-weight: bold;
    border: 0.05rem solid #000;
    font-size: 0.8rem;
    width: 0.8rem;
    line-height: 0.9rem;
    padding: 0.1rem;
  }

  .chart {
    margin: 0 0 0 1rem;
  }
}
</style>
