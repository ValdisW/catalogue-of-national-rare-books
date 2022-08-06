<template>
  <div class="container">
    <div class="title">
        {{ title }}
    </div>
    <div class="barchart">
    </div>
  </div>
</template>

<script>
const d3 = require("d3");

// const info = [
//     {
//         name: 'a',
//         value: 12
//     },
//     {
//         name: 'b',
//         value: 112
//     },
//     {
//         name: 'c',
//         value: 1022
//     },
// ]
const barchart_margin = {
    left: 0.1,
    right: 0.1,
    top: 0.05,
    bottom: 0.05
}
const bar_color = "gray"

export default {
  name: "Stack",
  props: ["canvasWidth", "canvasHeight", "title", "info"],
  data() {
    return {
    };
  },
  watch: {
    canvasWidth: function (newVal) {
        this.rescale(newVal, this.canvasWidth)
    },
    canvasHeight: function (newVal) {
        this.rescale(this.canvasWidth, newVal)
    },
  },
  methods: {
    rescale (width, height) {
        this.initializeBarchart(width, height)
    },
    get_name() {
        let lst = []
        this.info.forEach(e => {
            lst.push(e.name)
        });
        return lst
    },
    initializeBarchart(width, height) {

        let svgHeight = height * (1-barchart_margin.top-barchart_margin.bottom)
        let svgWidth = width * (1-barchart_margin.left-barchart_margin.right)
            
        d3.select('div.barchart').selectAll("svg").remove();
        this.svg = d3
            .select('div.barchart')
            .append("svg")
            .attr("width", width)
            .attr("height", svgHeight);

        let x = d3.scaleLinear()
                .domain([0, Math.log(d3.max(this.info, (l) => l.value))])
                .range([0, svgWidth]);
        let y = d3
            .scaleBand()
            .domain(this.get_name())
            .range([0, svgHeight])
            .padding(0.5);
        
        this.barchart = this.svg
            .selectAll("g")
            .data(this.info)
            .join("g")
            .attr("class", (d) => {
                "bar " + d.name;
            })
            .attr('transform', (d)=>`translate(${width*barchart_margin.left},${y(d.name)})`)

        this.barchart
            .append('g')
            .append('rect')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", (d) => x(Math.log(d.value)))
            .attr("height", y.bandwidth())
            .attr("fill", bar_color)
            .attr("fill-opacity", 0.8)
        
        this.barchart
            .append('g')
            .attr('transform', (d)=>`translate(${x(Math.log(d.value))},${y.bandwidth()/2})`)
            .append('text')
            .attr("font-size", "1rem")
            .text((d)=>d.value)
            

        // y axis
        let axis_y = d3
            .axisLeft()
            .scale(y)
            .ticks(this.info.length)
            .tickFormat((d) => d);

        this.svg
            .append("g")
            .attr("id", "axis")
            .attr("transform", `translate(${width*barchart_margin.left}, ${svgHeight * 0})`)
            .call(axis_y) // 将g作为函数参数调用函数
            .attr("font-size", "1rem")
            .selectAll("text")
            .text((d) => d);

    },
  },
  mounted() {
    this.initializeBarchart(this.canvasWidth, this.canvasHeight);
  },
};
</script>

<style scoped lang="less">
.container {
    background-color: rgba(231, 194, 61, 0.66);
    position: absolute;
    // .title {

    // }

    .barchart {
        position: absolute;
        left: 10vw;
    }
}
</style>
