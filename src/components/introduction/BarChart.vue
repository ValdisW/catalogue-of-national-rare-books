<script lang="ts" setup>
import { axisLeft, max, scaleBand, scaleLinear, select } from "d3";
import { computed, onMounted, ref, watch } from "vue";

const d3 = { axisLeft, max, scaleBand, scaleLinear, select };

const prop = defineProps<{
  canvasWidth: number;
  canvasHeight: number;
  title: string;
  info: { name: string; value: number }[];
  bar_color: string;
  margin_left: number;
}>();

const svg = ref<d3.Selection<SVGSVGElement, unknown, null, any> | null>(null);
const chart = ref(null);
const chartRef = ref<HTMLElement | null>(null);
const margin = ref({
  left: prop.margin_left,
  right: 0.15,
  top: 0.1,
  bottom: 0.1,
});

watch(
  () => prop.canvasWidth,
  (newVal) => {
    rescale(newVal, prop.canvasWidth);
  }
);

watch(
  () => prop.canvasHeight,
  (newVal) => {
    rescale(prop.canvasWidth, newVal);
  }
);

watch(
  () => prop.info,
  () => {
    initializeBarchart();
  }
);

const displayed_data = computed(() => {
  return prop.info.filter((el) => el.value > 0);
});

function rescale(width: number, height: number) {
  initializeBarchart(width, height);
}

function get_name() {
  let lst: string[] = [];
  displayed_data.value.forEach((e) => {
    lst.push(e.name);
  });
  return lst;
}

function initializeBarchart() {
  if (displayed_data.value) {
    let svgHeight = prop.canvasHeight * (1 - margin.value.top - margin.value.bottom),
      svgWidth = prop.canvasWidth * (1 - margin.value.left - margin.value.right);

    d3.select(chartRef.value).selectAll("svg").remove(); // 清除之前的svg
    svg.value = d3.select(chartRef.value).append("svg").attr("width", prop.canvasWidth).attr("height", svgHeight);

    let x = d3
      .scaleLinear()
      .domain([0, Math.log(d3.max(displayed_data.value, (l) => l.value)!)])
      .range([0, svgWidth]);
    let y = d3.scaleBand().domain(get_name()).range([0, svgHeight]).padding(0.5);
    
    // chart bars
    chart.value = svg.value
      .selectAll("g")
      .data(displayed_data.value)
      .join("g")
      .attr("class", (d) => {
        "bar " + d.name;
      })
      .attr("transform", (d) => `translate(${prop.canvasWidth * margin.value.left},${y(d.name)})`);

    // add bar
    chart.value
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", (d: { name: string; value: number }) => x(Math.log(d.value + 1)))
      .attr("height", y.bandwidth())
      .attr("fill", prop.bar_color)
      .attr("fill-opacity", 0.8);

    chart.value
      .append("text")
      .attr("transform", (d: { name: string; value: number }) => `translate(${x(Math.log(d.value + 1)) + 3},${y.bandwidth()})`)
      .attr("font-size", "0.6rem")
      .text((d: { name: string; value: number }) => d.value);

    // y axis
    let axis_y = d3
      .axisLeft(y)
      .ticks(displayed_data.value.length)
      .tickFormat((d) => d)
      .tickSizeOuter(0);

    svg.value
      .append("g")
      .attr("id", "axis")
      .attr("transform", `translate(${prop.canvasWidth * margin.value.left}, ${svgHeight * 0})`)
      .call(axis_y) // 将g作为函数参数调用函数
      .attr("font-size", "0.55rem")
      .selectAll("text")
      .text((d: string) => d);
  }
}

onMounted(() => {
  initializeBarchart();
});
</script>

<template>
  <div class="bar-chart">
    <div class="title" v-text="title"></div>
    <div class="chart" ref="chartRef"></div>
  </div>
</template>

<style scoped lang="less">
.bar-chart {
  position: relative;

  .title {
    position: absolute;
    left: 0;
    top: 0;
    font-weight: bold;
    border: 0.05rem solid #201d1d;
    font-size: 0.8rem;
    width: 0.8rem;
    line-height: 0.9rem;
    padding: 0.2rem 0.15rem;
  }

  .chart {
    margin: 0 0 0 1rem;
  }
}
</style>
