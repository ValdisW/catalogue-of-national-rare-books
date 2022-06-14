<template>
  <div class="vis-test"></div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";

export default {
  name: "VisTest",
  mounted() {
    axios.get("/data/").then((d) => {
      let container = d3.select(".vis-test");
      container
        .selectAll("div")
        .data(d.data)
        .enter()
        .append("div")
        .classed("circle", true)
        .style("height", "5px")
        .style("width", "5px")
        .style("background", "red");
    });
  },
};
</script>

<style lang="less" scoped>
.vis-test {
  width: 100vw;
  height: 100vh;
}
</style>
