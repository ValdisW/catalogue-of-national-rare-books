<template>
  <div class="container">
  </div>
</template>

<script>
const d3 = require("d3")
// import $ from 'jquery'
import * as Data from "@/data/dataLoader"
import * as Tooltip from "@/utils/Tooltip";
import { mapState } from 'vuex'

const margin = {
  "left": 0.05,
  "right": 0.05,
  "top": 0.05,
  "bottom": 0.05
}

const circle_r = '0.2rem'
const displayOrder = {
        1: "先秦两汉",
        2: "魏晋南北朝隋唐五代",
        3: "宋辽金夏元",
        4: "明清",
        5: "其它&未知",
      }

export default {
  name: "UnityView",
  props: ['canvasWidth', 'canvasHeight', "batchTitle"],
  data() {
    return {
        
    }
  },
  computed: {
    ...mapState(['rem'])
  },
  watch: { // for interaction
    batchTitle: function() {
      this.initializeUnityView(this.canvasWidth, this.canvasHeight)
    },
  },
  methods: {
    initializeDrawingFunction() {
      let self = this
      self.circleStyleNormal = circle => {
        circle
          .attr("fill", "rgb(192, 163, 18)")
          .attr('fill-opacity', 0.8)
          .style("cursor","pointer")

          // .attr('stroke', "black")
          // .attr('stroke-opacity', 0.8)
          // .attr('stroke-width', 1)
      }
      self.circlePos = (circle, circlePerRow) => {
        circle
          .attr('cx', (d,i)=>{(i%circlePerRow)*4})
      }
    },
    drawTooltip() {
      let tooltip = Tooltip.Tooltip()
        .extent([
            [0, 0],
            [this.svg.attr("width"), this.svg.attr("height")],
        ])
        .tips(
            ["名录ID", "图录解说"],
            ["名录ID: ", "图录解说: "],
            [null]
        )
        .fontSize(16)
        .padding([8, 4])
        .margin([10, 10]);
      d3.select(this.$el)
        .call(tooltip);
      this.svg.selectAll('circle').each(tooltip.events);
    },
    removeTooltip() {
      d3.select(this.$el).select('.d3Tooltip').remove();
    },
    drawDynastyDisplay() {
      let self = this
      self.dynastyStyle = dynastyDisplay => {
        let hmax=0;
        let w;
        d3.selectAll('.unity-display')._groups[0].forEach(e => {
          let unity_box = e.getBoundingClientRect()
          hmax=Math.max(hmax, unity_box.height)
          w=unity_box.width
        });

        dynastyDisplay
          .append('rect')
          .attr('class', "dynasty-display-box");


        dynastyDisplay
          .append('text')
          .attr('id', d=>'dynasty-text-'+d)
          .attr('font-size', '1rem')
          .text(d=>displayOrder[d]);

        let padding = 4

        dynastyDisplay
          .selectAll('rect')
          .attr('x', -padding)
          .attr('y',  d=>{
            let text_box = document.getElementById('dynasty-text-'+d).getBoundingClientRect();
            let text_h = text_box.height;
            return -text_h+'px';
          })
          .attr('height', d=>{
            let text_box = document.getElementById('dynasty-text-'+d).getBoundingClientRect();
            let text_h = text_box.height;
            return text_h + padding * 2 +'px';
          })
          .attr('width', d=>{
            let text_box = document.getElementById('dynasty-text-'+d).getBoundingClientRect();
            let text_w = text_box.width;
            return text_w + padding * 2 +'px';
          })
          .style("fill", 'rgba(192, 163, 18, 0.651)');

        dynastyDisplay
          .attr('transform', d=>{
            let text_box = document.getElementById('dynasty-text-'+d).getBoundingClientRect();
            let text_w = text_box.width;
            let offset=(w-text_w)/2;
            return `translate(${offset},${hmax+50})`;
          })
      }
    },
    initializeUnityView(width, height) {
      let self = this
      let batchNumber = this.batchTitle

      // let data = Data.get_data() // 获取数据
      let batchlist = Data.get_batch_list(batchNumber)
      // console.log(batchlist)

      
      let unitSetNum = Object.keys(displayOrder).length
      // console.log(unitSetNum)

      d3.select(self.$el).selectAll("svg").remove()
      self.svg = d3.select(self.$el)
        .append("svg")
        .attr("width", width)
        // .attr("height", height)
      self.unity = self.svg.append("g")
        .attr("id", "unity")
        .attr("transform", `translate(${width * margin.left}, ${height * margin.top})`)

      let svgWidth = width * (1 - margin.left - margin.right)
      // let svgHeight = height * (1 - margin.top - margin.bottom)
      
      let batchwidth = svgWidth/unitSetNum
      // let circlePerRow = parseInt(batchwidth*0.9/(circle_r*2))
      let circlePerRow = 20
      // console.log(circlePerRow)
      
      self.initializeDrawingFunction()
      self.removeTooltip()

      console.log(batchlist)
      self.unityset = self.unity.selectAll('g')
        .data(Object.keys(displayOrder))
        .join('g')
        // .attr('id', d=>'unityset '+d)
        .attr('class', d=>'unityset '+displayOrder[d])
        .attr("transform", (d,i)=>`translate(${i*batchwidth}, 0)`);
      self.unityset.append('g')
        .attr('class', "unity-display")
        .selectAll('circle')
        .data(d=>batchlist[displayOrder[d]])
        .join('circle')
        .attr('class', d=>`unit ${d}`)
        .attr('r', circle_r)
        .call(self.circleStyleNormal)
        .attr('cx', (d, i)=>0.6*(i%circlePerRow)+'rem')
        .attr('cy', (d, i)=>0.6*Math.floor(i/circlePerRow)+'rem')

      // text
      self.drawDynastyDisplay()

      self.dynastyDisplay = self.unity.selectAll('g.unityset')
        .append('g')
        .attr('class', "dynasty-display")
        .call(self.dynastyStyle);
      

      self.svg.attr('height', function(){
        let text_box = document.getElementsByClassName('dynasty-display')[0].getBoundingClientRect();
        console.log(text_box);
        return text_box.bottom
      })
      self.drawTooltip()
    }
  },
  mounted() {
    // this.initializeUnityView(this.canvasWidth, this.canvasHeight)
  }
}
</script>

<style scoped lang="less">

.container {
  overflow: scroll;
}

</style>
