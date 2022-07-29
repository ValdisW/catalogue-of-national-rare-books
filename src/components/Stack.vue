<template>
  <div class="container"></div>
</template>

<script>
const d3 = require("d3");
import * as Data from "@/data/dataLoader";
import * as Tooltip from "@/utils/Tooltip";

// const xOrder = {
//         0: "戰國",
//         1: "秦",
//         2: "漢",
//         3: "三国",
//         4: "魏晋",
//         5: "南北朝",
//         6: "唐",
//         7: "隋",
//         8: "五代十国",
//         9: "宋",
//         10: "元",
//         11: "明",
//         12: "清",
//       }

const xOrder = [
  "戰國",
  "秦",
  "西漢",
  "晉",
  "西晉",
  "東漢",
  "隋",
  "唐",
  "晚唐",
  "北魏",
  "後梁",
  "西涼",
  "南北朝",
  "大魏",
  "西魏",
  "明",
  "南宋",
  "宋",
  "元",
  "蒙古",
  "金",
  "北宋",
  "宋元明清",
  "元至清",
  "遼",
  "大理國",
  "五代",
  "齊",
  "宋蜀",
  "清",
  "西夏",
  "高昌",
  "東晉",
  "北涼",
  "北齊",
  "六朝",
  "後周",
  "武周",
  "南明",
  "太平天國",
  "謄清",
  "西夏或元",
  "北元",
  "唐五代",
  "五代宋初",
  "拉薩",
  "梁",
  "明末",
  "明末清初",
  "民國",
  "巴塞爾",
  "威尼斯",
  "日本長崎",
  "安特衛普",
  "佩薩羅",
  "羅馬",
  "奧古斯堡",
  "維也納",
  "米蘭",
  "愛丁堡",
  "倫敦",
  "後唐",
];
const yOrder = ["漢文古籍", "少數民族文字古籍", "其他文字古籍"];
// const batchKeys = [
//     '第1批', '第2批', '第3批', '第4批', '第5批', '第6批'
// ]

export default {
  name: "Stack",
  props: ["canvasWidth", "canvasHeight", "batchSel"],
  data() {
    return {
      colors: ["#677885", "#e0a1a5", "#90ccc5"],
    };
  },
  watch: {
    // for interaction
    batchSel: function (newVal, oldVal) {
      console.log(newVal, oldVal);
      let flg = true;
      for (let i in this.batchSel) {
        if (this.batchSel[i]) {
          flg = false;
          break;
        }
      }
      let sel;
      if (flg) {
        sel = new Array(6).fill(1);
      } else {
        sel = this.batchSel;
      }
      this.draw(sel);
    },
  },
  methods: {
    initializeDrawingFunction() {
      let self = this;
      self.rectStyle = (rect) => {
        rect
          .attr("fill", (d, i) => this.colors[i])
          .attr("fill-opacity", 0.8)
          .style("cursor", "pointer");
      };
    },
    initializeHoverFunction() {
      this.rectHover = (rect) => {
        rect
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
    processStack(sel) {
      let mydata = Data.get_stack_data(xOrder, yOrder, sel);
      let stackgen = d3
        .stack()
        .keys(yOrder)
        .offset(d3.stackOffsetNone)
        .order(d3.stackOrderNone);
      return stackgen(mydata);
    },
    drawTooltip() {
      let processFunc = function (e, d) {
        console.log(e, d);
        let mydata = { 批次: d.key };
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
      this.svg.selectAll("rect").each(tooltip.events);
    },
    removeTooltip() {
      d3.select(this.$el).select(".d3Tooltip").remove();
    },
    draw(sel) {
      let self = this;

      this.layers = this.processStack(sel);
      this.stack.selectAll("g").remove();

      this.stack
        .selectAll("g")
        .data(this.layers)
        .join("g")
        .attr("class", (d) => {
          "stack " + d.key;
        })
        .call(this.rectStyle)
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("class", (d) => "stack " + d.data.name)
        .attr("x", (d) => self.x(d.data.name))
        .attr("y", (d) => self.y(d[1]))
        .attr("width", self.x.bandwidth())
        .attr("height", (d) => self.y(d[0]) - self.y(d[1]))
        .call(this.rectHover);
    },
    get_max_cnt() {
      let tmp_layer = this.processStack(Array(6).fill(1));
      return d3.max(tmp_layer, (l) => d3.max(l, (d) => d[1]));
    },
    initializeStack(width, height) {
      let self = this;

      let bottom = 0.1;

      this.processStack();

      self.initializeDrawingFunction();
      self.initializeHoverFunction();

      d3.select(self.$el).selectAll("svg").remove();
      self.svg = d3
        .select(self.$el)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      self.stack = self.svg.append("g").attr("id", "stack");

      // this.x = d3.scaleLinear()
      //         .domain([0, Object.keys(xOrder).length-1])
      //         .range([0, svgWidth]);
      this.x = d3.scaleBand().domain(Object.values(xOrder)).range([0, width]);
      this.y = d3
        .scaleLinear()
        .domain([0, this.get_max_cnt()])
        .range([height * (1 - bottom), 0]);

      self.removeTooltip();

      // x axis
      let axis_x = d3
        .axisBottom()
        .scale(self.x)
        .ticks(Object.keys(xOrder).length)
        .tickFormat((d) => d);

      self.svg
        .append("g")
        .attr("id", "axis")
        .attr("transform", `translate(${width * 0}, ${height * (1 - bottom)})`)
        .call(axis_x) // 将g作为函数参数调用函数
        .attr("font-size", "0.4rem")
        .selectAll("text")
        .text((d) => d);

      self.drawTooltip();
    },
  },
  mounted() {
    this.initializeStack(this.canvasWidth, this.canvasHeight);
  },
};
</script>

<style scoped lang="less">
.container {
  // overflow: scroll;
}
</style>
