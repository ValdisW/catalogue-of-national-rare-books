<template>
  <div class="bar-chart"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "barChart",
  props: {
    title: String,
    data: Object,
  },
  methods: {
    render() {
      let svg = d3.select(".bar-chart").append("svg");
      /**
       * 數據格式：
       * {
       *    "戰國": 1234,`
       *    "秦": 333,
       *    "漢": 666
       * }
       */
      const xScale = d3.scaleLog([0, d3.max(this.data)], [30, 300]); // x轴的数值和渲染范围
      const yScale = d3
        .scaleBand(new d3.InternSet(d3.map(this.data, (d, i) => i)), [10, 100])
        .padding(0.1);
      const xAxis = d3.axisTop(xScale).ticks(5);
      const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

      svg
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

      svg.append("g").attr("transform", `translate(${30},0)`).call(yAxis);

      svg
        .append("g")
        .attr("fill", "#333")
        .selectAll("rect")
        .data(this.data)
        .join("rect")
        .attr("x", xScale(0))
        .attr("y", (d, i) => yScale(i))
        .attr("width", (d) => xScale(d) - xScale(0))
        .attr("height", yScale.bandwidth());
    },
  },
  mounted() {
    this.render();
  },
};
</script>

<style lang="less" scoped>
.bar-chart {
  background: #6666;
}
</style>
