<template>
      <g class='Map'></g>
</template>

<script>
import * as d3 from 'd3'
import { mapState, mapActions } from "vuex";
import global from "@/constants/global"
import * as Data from "@/data/dataLoader"
// import { jsonp } from 'vue-jsonp'

// const delay_time = 100
const Province_Background = "rgb(202, 167, 127)"
// const Highlight_Province_Background = "#f2d7a1"
const Province_Stroke = "rgb(202, 167, 127)"
const Country_Stroke = "rgb(180,145,120)"
const Institution_Color = "rgba(177, 44, 11, 0.818)"
// const Country_Stroke_light = "rgb(224,199,166)"
const cn = require(`../../static/data/china.json`)
const nanhai = require(`../../static/data/nanhai.json`)
const islands = require(`../../static/data/islands.json`)
const taiwan = require(`../../static/data/71.json`)
const china_all_province_map = require(`../../static/data/china_all_province_map.json`)
const time_duration = 500;
export default {
  name: 'Map',
  data() {
    return {
      projection: null,
      // batchTitle: null,
    }
  },
  props: {
      size: {
        type: Object,
        default: function () {
          return { width: 0, height: 0 };
        }
      },
      batchTitle: {
        type: String,
        default: "第1批"
      }
    },
  watch: {
    size: function (val, oldval) {
      const self = this
      console.log(val, oldval)
      self.init()  //强制false，true才判断Period和Type
    },
    batchTitle: function (val, oldval) {
      console.log(val, oldval)
      this.init()
    },
    CurrentCount: function (val, oldval) {
      console.log(val, oldval)
      const self = this
      self.changeTitle()
    },
    InteractionId: function (val, oldval) {
      console.log(val, oldval)
      const self = this
      let project = (self.MainMouseover.project == null || self.MainMouseover.project == "") ? self.SelectedProject : self.MainMouseover.project
      let province = (self.MainMouseover.project_province == null || self.MainMouseover.project_province == "") ? self.SelectedProvince : self.MainMouseover.project_province
      if(self.Interaction.signal == 'Project' || self.Interaction.signal == 'SelectedProject'){
        console.log(0)
      }else if(self.Interaction.signal == "NULL" && (self.Interaction.old_signal == 'Project' || self.Interaction.old_signal == 'SelectedProject')){
        console.log(0)
      }else if(self.Interaction.signal == 'SelectedProvince' || (self.Interaction.signal != 'SelectedProvince') && self.SelectedProvince != ""){
        self.clickProvince(self.SelectedProvince)
        self.display_data = self.GetStatistic()
        self.Cache_display_projects()
        self.AppendLocation()
      }else{
          self.display_data = self.data.slice(0)
          self.Cache_display_projects()
          self.AppendLocation()
      }
      self.highlightProvince(province)
      self.ActionForSelect(project, self.SelectedProvince != "")
      self.changeTitle()
    },
  },
  mounted() {
    // this.$on("batchChanged", b => {
    //   console.log("batch", b)
    //   this.batchTitle = b;
    // })
    // let self = this
  },
  components: {

  },
  computed: {
  },
  methods: {
    // updateBatchTitle() {
    //   console.log(this.batchTitle)
    // },
    // clickProvince(province, isCompulsory = false) {
    //   let self = this;
    //   let previous_centeredProvince = self.centeredProvince;
    //   if (province == previous_centeredProvince) return

    //   let x, y, scale;
    //   // let isReset = false
    //   /* get transform parameters */

    //   if (province != "") {
    //     let centroid = self.centroid_dict[province];
    //     x = centroid[0];
    //     y = centroid[1];
    //     let bounds = self.bounds_dict[province];
    //     scale =
    //       Math.min(
    //         self.SvgWidth / Math.abs(bounds[1][0] - bounds[0][0]),
    //         self.SvgHeight / Math.abs(bounds[1][1] - bounds[0][1])
    //       ) * 0.815; // 0.8 // 0.85
    //     self.centeredProvince = province;
    //     // isReset = false
    //   } else {
    //     x = self.SvgWidth / 2;
    //     y = self.SvgHeight / 2;
    //     scale = 1;
    //     self.centeredProvince = "";
    //     // isReset = true
    //   }

    //   self.scale = scale;
    //   self.cityBorderStroke = self.scale == 1 ? 0.1 : 0.12 / self.scale + "rem"
    //   let ProvinceTarget = self.centeredProvince
    //     ? self.centeredProvince
    //     : previous_centeredProvince;
    //   function showCity() {
    //     self.map.select("#layer_city").style("visibility", "visible")
    //     self.layer_circle
    //       .style("opacity", 1)
    //       .style("visibility", "visible")
    //     self.map.select("#layer_contour")
    //       .style("opacity", 1)
    //       .style("visibility", "visible")
      

    //   }
    //   function transformCityLevelElements() {
    //     transformElement(self.map.select("#layer_city"));
    //     self.map.select("#layer_city").selectAll(".city").style("stroke-width", self.cityBorderStroke)
    //   }
    //   function transformOtherProvinces() {
    //     // transform other provinces
    //     transformElement(
    //       self.map
    //         .select("#layer_province")
    //         .selectAll(".g-single-province.hidden_layer")
    //     );
    //   }
    //   function transformCirles(){
    //     transformElement(
    //       self.map.select("#layer_circle")
    //     );
    //     transformElement(
    //       self.map.select("#layer_contour")
    //     );
    //     transformElement(
    //       self.map.select("#layer_cityName")
    //     );
    //   }
    //   function transformElement(g) {
    //     g.attr(
    //       "transform",
    //       "translate(" +
    //         self.SvgWidth / 2 +
    //         "," +
    //         self.SvgHeight / 2 +
    //         ")scale(" +
    //         self.scale +
    //         ")translate(" +
    //         -x +
    //         "," +
    //         -y +
    //         ")"
    //     )
    //   }

    //   if (province != "") {
    //     // into province view
    //     // hide other layers
    //     self.map.select("#layer_city")
    //       .style("visibility", "hidden");

    //     // hide circle of projects
    //    self.map.select("#layer_circle")
    //       .style("opacity", 0)
    //       .style("visibility", "hidden");

    //   self.map.select("#layer_contour")
    //       .style("opacity", 0)
    //       .style("visibility", "hidden");

    //     self.map.selectAll(".Borders").style("visibility", "hidden");
    //     self.gIslands.style("visibility", "hidden");
    //     self.taiwan.style("visibility", "hidden");

    //     d3.select(self.$el)
    //       .selectAll("#south-china-sea-islands-canvas")
    //       .style("visibility", "hidden");

    //     // hide other provinces
    //     self.map
    //       .selectAll(".g-single-province")
    //       .classed("hidden_layer", true)
    //       .classed("active", false);

    //     // show the clicked one
    //     self.map
    //       .select("#map-single-province-" + ProvinceTarget)
    //       .classed("hidden_layer", false)
    //       .classed("active", true);

    //     // hide cities in other provinces
    //     self.map
    //       .selectAll(".g-map-province")
    //       .classed("hidden_layer", true)
    //       .classed("active", false);
        
    //     // show cities in the clicked province
    //     self.map
    //       .select("#map-g-" + ProvinceTarget)
    //       .classed("hidden_layer", false)
    //       .classed("active", true);

    //     // hide cities in other provinces
    //     self.map
    //       .selectAll(".province-cityName-g")
    //       .classed("active", false);
        

    //     transformOtherProvinces();
    //     transformCityLevelElements();
    //     transformCirles();
    //     // transform the clicked one
    //     self.map
    //       .select("#map-path-" + ProvinceTarget)
    //       .classed("hidden_layer", false)
    //       .classed("active", true);
    //     transformElement(self.map.select("#layer_province").select("#map-single-province-" + ProvinceTarget).transition().duration(time_duration))

    //     d3.timeout(function() {
    //       showCity();
    //       self.map
    //         .select("#layer_province")
    //         .select("#map-single-province-" + ProvinceTarget)
    //         .classed("hidden_layer", true);
            
    //     self.map
    //       .select("#province-cityName-g-" + ProvinceTarget)
    //       .classed("active", true)
    //       .selectAll("text")
    //       .style("font-size", (1.0 / self.scale) + "rem")
    //       // .attr("y", self.radius + "rem");
    //     }, time_duration * 0.98);
    //     // d3.timeout(function() {
    //     //   showOverlays();
    //     // }, time_duration);
    //   } else {
    //     // into country view
    //     // hide other layers

    //     self.map
    //       .select("#layer_city")
    //       .style("visibility", "hidden");
        
    //     self.map.select("#layer_circle")
    //       .style("opacity", 0)
    //       .style("visibility", "hidden");

    //     self.map.select("#layer_contour")
    //       .style("opacity", 0)
    //       .style("visibility", "hidden");

    //     // hide cities in other provinces
    //     self.map.selectAll(".province-cityName-g")
    //       .classed("active", false);

    //     // hide other provinces
    //     self.map.selectAll(".g-single-province").classed("hidden_layer", true);
    //     // show the clicked one
    //     self.map
    //       .select("#map-single-province-" + ProvinceTarget)
    //       .classed("hidden_layer", false)
    //       .classed("active", true);
    //     // hide text of all cities

    //     transformOtherProvinces();
    //     transformCityLevelElements();
    //     transformCirles();
    //     // transform the clicked one
    //     self.map
    //       .select("#map-path-" + ProvinceTarget)
    //       .classed("hidden_layer", false)
    //       .classed("active", true);
    //     transformElement(self.map.select("#layer_province").select("#map-single-province-" + ProvinceTarget).transition().duration(time_duration))
         

    //     d3.timeout(function() {
    //       self.map.selectAll(".g-single-province").classed("hidden_layer", false);
    //     }, time_duration * 0.98);
    //     d3.timeout(function() {
    //       showCity();
    //       // showOverlays();
    //       self.map.selectAll(".Borders").style("visibility", "visible");
    //       self.gIslands.style("visibility", "visible");
    //       self.taiwan.style("visibility", "visible");
    //       d3.select(self.$el)
    //         .select("#south-china-sea-islands-canvas")
    //         .style("visibility", "visible");
    //     }, time_duration);
    //   }
    // },
    // Cache_display_projects(){
    //     let self = this;
    //     let length = self.AllData.length;
    //     self.display_projects = {}
    //     let CurrentCount = 0
    //     for (let i = 0; i < length; i++){
    //         if(self.AllData[i]["show"] == false || self.AllData[i]["inTimeSlot"] == false || self.AllData[i]["inPeriod"] == false || self.AllData[i]["containUnit"] == false || self.AllData[i]["inProvince"] == false || self.AllData[i]["inUnitStatus"] == false) continue
    //         // if(self.filterCondition.status != ""){ //在其他部分处理
    //         //   if(self.filterCondition.unit != ""){
    //         //       if(self.filterCondition.status == global.Status[1] && self.filterCondition.unit == self.AllData[i]["发掘单位集合"][0])  continue
    //         //       if(self.filterCondition.status == global.Status[0] && self.filterCondition.unit != self.AllData[i]["发掘单位集合"][0])  continue
    //         //   }else{
    //         //       if(self.filterCondition.status == global.Status[1] && self.AllData[i]["发掘单位集合"].length == 1)  continue
    //         //   }
    //         // }
    //         self.display_projects[self.AllData[i]["考古发现名称"]] = true
    //         CurrentCount += 1;
    //     }
    //     for (let i = 0; i < self.display_data.length; i++){
    //         self.display_data[i].show = self.display_projects[self.data[i].name]
    //     }
    //     self.CurrentCount = CurrentCount
    // },
    // highlightProvince(province){
    //     let self = this;
    //     self.map.selectAll(".province").attr("fill", function(d) {
    //       if(province != "" && d3.select(this).classed(province)) return Highlight_Province_Background
    //           return Province_Background
    //       })
    // },
    ProcessRawdata(){
      let self = this;
      self.inst_id_list = Data.get_institution_list()
      let display_data = {}
      let inst_dict = {}
      let max_cnt = 0

      for (let inst_id in self.inst_id_list){
          let inst_info = Data.get_institution_info(self.inst_id_list[inst_id])
          // console.log(inst_info)

          if (inst_info['经度']==undefined) continue;
          
          let loc=self.projection([inst_info['经度'], inst_info['纬度']])
          inst_dict[self.inst_id_list[inst_id]]={
            'id': self.inst_id_list[inst_id],
            'name': inst_info['馆名'],
            'x': loc[0],
            'y': loc[1],
            'cnt': inst_info.cnt
          }
          max_cnt = Math.max(max_cnt, inst_info.cnt)
      }

      console.log(Data.get_batch_list(self.batchTitle))
      let batch_list = Data.get_batch_list(self.batchTitle)
      for (let dynasty in batch_list) {
        let dy_lst = batch_list[dynasty]
        for (let book_id in dy_lst) {
          let book_info = Data.get_book_info(dy_lst[book_id])
          let inst_id = book_info['收藏单位代码']
          if (display_data[inst_id]==undefined && inst_dict[inst_id]!=undefined) {
            display_data[inst_id]=inst_dict[inst_id]
            display_data[inst_id].cnt=1
          }
          else if (display_data[inst_id]!=undefined) {
            display_data[inst_id].cnt=display_data[inst_id].cnt+1
          }
        }
      }
      
      self.display_data = Object.values(display_data)
      self.max_cnt = max_cnt
    },
    init() {

      let self = this;
      self.CurrentCount = 310
      self.InitMap(cn, nanhai, islands, taiwan) //不需要换页，使用同步即可
      self.normal_radius = self.SvgWidth * 0.004
      self.scale = 1
      self.ProcessRawdata()


      // self.display_data = self.data.slice(0)

      self.AppendLocation() //测试1:展示所有的
      // // for (let i = 0; i < global.Periods.length; i++){
      // //     let data = global.ArrFilter(self.data, 'period_agg', global.Periods[i])
      // //     self.AppendLocation(data, "", global.Periods[i], true)
      // // }

      //Zoom functions
        self.svg
          .call(d3.zoom()
          .extent([[0, 0], [self.SvgWidth, self.SvgHeight]])
          .scaleExtent([1, 4])
          .on("zoom", zoomed))
          .on('dblclick.zoom', null);

      function zoomed({transform}) {
        self.Mapsvg.attr("transform", transform);
      }
    },
    AppendLocation(){
      let self = this;
      self.map.select("#layer_contour").selectAll("path").remove()
      self.rScale = d3.scaleLinear()
                .domain([0, self.max_cnt+1])
                .range([2, 30])

      // let showWordle = self.SelectedPeriod.length == 0 ? false : true
      // if (showWordle) self.drawWordle(self.display_data) //只在展示某一类型的时候有contour

      self.layer_circle.selectAll('.Location')
        .data(self.display_data)
        // .join("g")    //自动根据数据更新
        // .attr('class', 'layer_prov')
        .join('circle')
        .attr("class", function(d) {
          return "Location " + d.name
        })
        .attr('fill', Institution_Color)
        // .style('visibility', d=>d.show? 'visible' : 'hidden')
        // .style("stroke", "gray")
        // .style("stroke-width", self.radius * 0.2)
        .attr('r', d => self.rScale(d.cnt))
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style("cursor","pointer")
        // .on("mouseover", function(event, d){
        //       if(self.keepTooltip.type != "") return
        //       // self.timer= setTimeout(function(){
        //         self.updateMainMouseover({
        //           'signal': 'Project',
        //           "timeslot": {},
        //           "period": "",
        //           "project": d.name,
        //           "project_province": "",
        //           "status":"",
        //           "cooperation": "",
        //           "type": "",
        //           "unit": "",
        //           "unit_group": "",
        //           "unit_regtype": "",
        //           "unit_province": "",
        //         })
        //       let html = self.$parent.ProjectDetailTooltip(d.name, d.period_agg, d.type, d.project["发掘单位集合"].join("、"), d.project["发掘领队"], d.project["省"] + d.project["市"] + d.project["区县"], d.project["历史意义"], d.project["链接"])
        //       self.$parent.ShowTooltip(event.pageX, event.pageY, html)
        //       // },50);
        // })
        // .on("mouseout", function(event, d){
        //       console.log(event, d)
        //       if(self.keepTooltip.type != "") return
        //       // clearTimeout(self.timer);
        //       self.updateMainMouseover({
        //           'signal': 'NULL',
        //           "timeslot": {},
        //           "period": "",
        //           "project":"",
        //           "project_province": "",
        //           "status":"",
        //           "cooperation": "",
        //           "type": "",
        //           "unit": "",
        //           "unit_group": "",
        //           "unit_regtype": "",
        //           "unit_province": "",
        //         })
        //       d3.select("#Tooltip").style("visibility", "hidden")
        // })
        // .on("click", function(event, d){
        //     if(self.keepTooltip.type == "Project" && d.name == self.keepTooltip.val){
        //       self.updateKeepTooltip({"type": "", "val": ""})
        //       // self.updateSelectedProject("")
        //     }else{
        //         self.updateMainMouseover({
        //           'signal': 'Project',
        //           "timeslot": {},
        //           "period": "",
        //           "project": d.name,
        //           "project_province": "",
        //           "status":"",
        //           "cooperation": "",
        //           "type": "",
        //           "unit": "",
        //           "unit_group": "",
        //           "unit_regtype": "",
        //           "unit_province": "",
        //         })
        //       let html = self.$parent.ProjectDetailTooltip(d.name, d.period_agg, d.type, d.project["发掘单位集合"].join("、"), d.project["发掘领队"], d.project["省"] + d.project["市"] + d.project["区县"], d.project["历史意义"], d.project["链接"])
        //       self.$parent.ShowTooltip(event.pageX, event.pageY, html)
        //       self.updateKeepTooltip({"type": "Project", "val": d.name})
        //       // self.updateSelectedProject(d.name)
        //     }
        // })
    },
    // drawWordle(data){
    //   let self = this;
    //   data  = data.filter(d=>d.show)
    //   let pointnum = Math.max(data.length, 200)
    //   let contours = d3.contourDensity()
    //     .x(d =>  d.x)
    //     .y(d => d.y)
    //     .size([self.SvgHeight, self.SvgWidth])
    //     .bandwidth(pointnum / 15) //连接程度
    //     .thresholds(pointnum / 45)(data)  //起点

    //   let max = Math.max(...contours.map(d => d.value * 1.01))
    //   var color = d3.scaleLinear()
    //       .domain([0, max]) // Points per square pixel.
    //       .range([Province_Background, self.contourColor])

    //   self.map.select("#layer_contour")
    //     .selectAll("path")
    //     .data(contours)
    //     .join("path")
    //     .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
    //     .attr("d", d3.geoPath())
    //     .style("opacity", 0.4)
    //     .attr("fill", function(d) {
    //       return color(d.value);
    //     });
    // },
    // GroupFilter(data, group){
    //   //  if (group == undefined || group.length == 0) return data.slice(0)
    //   //  return data.filter(d => d["project"]["发掘单位性质"].filter(function(v){ return group.indexOf(v) > -1 }).length > 0)
    //     if (group == undefined || group == "") return data.slice(0)
    //     return data.filter(d => d["project"]["发掘单位性质"].indexOf(group) > -1)
    // },
    ActionForSelect(project, isClick){
        console.log(isClick)
        let self = this
        if (project == ""){
            self.Mapsvg.selectAll(".Location").classed("highlight", false).classed("hidden_node", false)
        }
        if (project != ""){
          self.Mapsvg.selectAll(".Location").classed("highlight", false).classed("hidden_node", true)
          self.Mapsvg.selectAll(".Location." + project).classed("highlight", true).classed("hidden_node", false)
        }
    },
    // ActionForTimeSlot(val){  // 没必要把时间段外的用低透明度表示
    //     let self = this
    //     d3.selectAll(".Location").each(function(p,i){
    //         let el  = d3.select(this)
    //         let year = Number(p["project"]["年份"])
    //         if(val == "" || (val.start <= year && val.end >= year)){
    //           el.style("opacity", 1)
    //         }else{
    //           el.style("opacity", 0.1)
    //         }
    //     })
    // },
    AppendBorders(cn, nanhai, islands, taiwan){
      let self = this
      let path = self.path;
      //添加两层国家边界
      // self.map.append("g")
      //   .attr("id", "layer_CountryBorder_Outer")
      //   .attr("class", "Borders")
      //   .selectAll("path")
      //   .data(cn.features)
      //   .enter()
      //   .append("path")
      //   .attr("d", path)
      //   .attr("class", "BackStroke")
      //   .attr('stroke', Country_Stroke_light)
      //   .attr('stroke-width', "0.5rem")


      self.map.append("g")
        .attr("id", "layer_CountryBorder_Inner")
        .attr("class", "Borders")
        .selectAll("path")
        .data(cn.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "BackStroke")
        .attr('stroke', Country_Stroke)
        .attr('stroke-width', "0.15rem")

      // self.map.append("g")
      //   .attr("id", "layer_IslandsBorder_Outer")
      //   .attr("class", "Borders")
      //   .selectAll("path")
      //   .data(islands.features)
      //   .enter()
      //   .append("path")
      //   .attr("d", path)
      //   .attr("class", "BackStroke")
      //   .attr('stroke', Country_Stroke_light)
      //   .attr('stroke-width', "0.3rem")

      self.map.append("g")
        .attr("id", "layer_IslandsBorder_Inner")
        .attr("class", "Borders")
        .selectAll("path")
        .data(islands.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "BackStroke")
        .attr('stroke', Country_Stroke)
        .attr('stroke-width', "0.15rem")

      // self.map.append("g")
      //   .attr("id", "layer_TaiwanBorder_Outer")
      //   .attr("class", "Borders")
      //   .selectAll("path")
      //   .data(taiwan.features)
      //   .enter()
      //   .append("path")
      //   .attr("d", path)
      //   .attr("class", "BackStroke")
      //   .attr('stroke', Country_Stroke_light)
      //   .attr('stroke-width', "0.3rem")

      self.map.append("g")
        .attr("id", "layer_TaiwanBorder_Inner")
        .attr("class", "Borders")
        .selectAll("path")
        .data(taiwan.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "BackStroke")
        .attr('stroke', Country_Stroke)
        .attr('stroke-width', "0.13rem")
    },
    InitMap(cn, nanhai, islands, taiwan) {
      let self = this
      self.SvgWidth = self.size.width * 0.95;
      self.SvgHeight = self.size.height * 0.95;
      self.svg = d3.select(self.$el)
      self.radiusem =  Number(window.getComputedStyle(document.documentElement)["fontSize"].replace("px", ""))
      self.tranforming = false
      
      self.svg.append("rect")
          .attr("class", "background")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", self.size.width)
          .attr("height", self.size.height)
          .style("fill", "#f2d7a1")

      self.Mapsvg = self.svg.append('g')
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", `${ 0 } ${ 0 } ${self.SvgWidth} ${self.SvgHeight}`)
        .attr('id', "Mapsvg")
        .attr('transform', 'translate(' + 0 + ',' + 0 + ')');


      d3.selectAll('.redline').remove()
      d3.select('#map').remove()
      d3.select('.liti').remove()
      // d3.select('#south-china-sea-canvas').remove()
      var map = self.Mapsvg.append('g')
        .attr('id', "map")
        .attr('transform', function () {
          return `translate(${(self.size.width - self.SvgWidth) / 2},${(self.size.height - self.SvgHeight) / 2})`
        })
        .attr('width', self.SvgWidth)
        .attr('height', self.SvgHeight)
      

      self.map = map;
      map.append('defs').html(`
        <filter id="f-shadow-province" x="-100%" y="-100%" width="500%" height="500%">
          <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
          <feColorMatrix result="matrixOut" in="offOut" type="matrix"
        values="0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 1 0" />
          <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="5" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      `)
      let projection = d3.geoMercator().fitSize([self.SvgWidth, self.SvgHeight], cn);
      self.path = d3.geoPath().projection(projection);
      // let data = self.ProvinceData[self.thisYear]
      self.projection = projection
      self.centroid_dict = {}
      self.bounds_dict = {}
      self.AppendBorders(cn, nanhai, islands, taiwan)

      map.append("g")
          .attr("id", "layer_city")
          // .style("visibility", "hidden")
          .selectAll(".g-map-province")
          .data(Object.entries(china_all_province_map))
          .join("g")
          .attr("class", "g-map-province")
          .attr("id", d => "map-g-" + d[0])
          .selectAll("path")
          .data(d=>d[1].features)
          .join("path")
          .attr("id", function (d) {
            return "map-path-" + d.properties.name
          })
          .attr("class", "city")
          .attr("fill", function() {
            return Province_Background
          })
          .attr("d", self.path)
          .attr('stroke', Province_Stroke) // province stroke
          .attr('stroke-width', 0.3)
          // .attr("fill", "transparent"),

      self.layer_cityName = map.append("g")
        .attr("id", "layer_cityName")
        .attr("pointer-events", "none")
        .selectAll(".province-cityName-g")
        .data(Object.entries(china_all_province_map))
        .join("g")
        .attr("class", "province-cityName-g")
        .attr("id", d => "province-cityName-g-" + d[0])
        .selectAll("text")
        .data(d=>d[1].features)
        .join("text")
        .attr("alignment-baseline","text-before-edge")
        .attr("text-anchor", "middle")
        .attr("id", function (d) {
            return "cityName-" + d.properties.name
        })
        .attr("class", function () {
            return "cityName"
        })
        .attr("x", function (d) {
            if(d.properties.temp_country == "台湾" || d.properties.temp_country == "澳门" || d.properties.temp_country == "香港") return
            return self.projection(d.properties.cp)[0]
        })
        .attr("y", function (d) {
            if(d.properties.temp_country == "台湾" || d.properties.temp_country == "澳门" || d.properties.temp_country == "香港") return
            return self.projection(d.properties.cp)[1]
        })
        .text(d => {
          if (d.properties.name == "南岸" || d.properties.name == "大渡口"|| d.properties.name == "沙坪坝"|| d.properties.name == "北碚"|| d.properties.name == "九龙坡") { //重庆的城市遮挡
            return ""
          }
          return d.properties.name;
        });

      map.append("g")
        .attr("id", "layer_province")
        .attr("class", "layer_province")
        .selectAll(".g-single-province")
        .data(cn.features)
        .join("g")
        .attr("id", d => "map-single-province-" + self.Long2Short(d.properties.name))
        .attr("class", "g-single-province")
        .append("path")
        .attr("class", "province")
        .attr("id", function (d) {
            let name = self.Long2Short(d.properties.name)
            self.centroid_dict[name] = self.path.centroid(d);
            self.bounds_dict[name] = self.path.bounds(d);
            return "map-path-" + name
        })
        .attr("fill", function() {
          // return self.GetColor(data[self.Long2Short(d.properties.name)].count);
          return Province_Background
        })
        .attr("d", self.path)
        .attr('stroke', Province_Stroke)
        .attr('stroke-width', 0.3)
        // .attr('pointer-event', 'visible')
        .on("click", function(event, d){
            if (self.tranforming == true) return
            if(self.Long2Short(d.properties.name) == self.SelectedProvince  && self.SelectedProvince != ""){
              self.updateSelectedProvince("")
            }else{
              self.updateSelectedProvince(self.Long2Short(d.properties.name))
            }
            self.tranforming = true
            self.timer= setTimeout(function(){
              self.tranforming = false
            }, time_duration + 100);
        })
        // .style('cursor', 'pointer')
        // .on('mouseover', function (el, d) {      //不使用hover，否则在选择项目是会误触发
        //   self.timer= setTimeout(function(){
        //     let province = self.Long2Short(d.properties.name)
        //     if(province == "台湾" || province == "天津" || province == "澳门") return //这几个省份没有项目
        //     self.updateMainMouseover({
        //               'signal': 'Province',
        //               "timeslot": {},
        //               "period": "",
        //               "project":"",
        //               "project_province": province,
        //               "type": "",
        //               "unit": "",
        //               "status":"",
        //               "cooperation": "",
        //               "unit_group": "",
        //               "unit_regtype": "",
        //               "unit_province": "",
        //             })
        //       },50);
        //   })
        //   .on('mouseout', function (el, d) {      //g的第一个元素不是d
        //     clearTimeout(self.timer);
        //     self.updateMainMouseover({
        //         'signal': 'NULL',
        //         "timeslot": {},
        //         "period": "",
        //         "project":"",
        //         "project_province": "",
        //         "status":"",
        //         "type": "",
        //         "unit": "",
        //         "unit_group": "",
        //         "cooperation": "",
        //         "unit_regtype": "",
        //         "unit_province": "",
        //       })
        //   }),
      
      self.contourColor = "steelblue" //Period != "" ? global.PeriodsColorMap(Period) : "steelblue"
      
      self.layer_contour = self.map.append("g")
        .attr("id", "layer_contour")
        .attr("fill", "none")
        .attr("stroke", self.contourColor)
        .attr("stroke-linejoin", "round")

      self.layer_circle = map.append("g").attr("id", "layer_circle")
        // .attr('transform', 'translate(' + (self.size.width - self.SvgWidth) / 2 + ',' + (self.size.height - self.SvgHeight) / 2 + ')')

      self.gIslands = map.append('g')
        .attr('class', 'gIslands')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .selectAll(".g-single-island")
        .data(islands.features)
        .enter()
        .append("g")
        .attr('class', 'g-single-island')
        // .attr("id", d => "map-single-island-" + d.properties.id)
        .append("path")
        .attr("class", "island")
        .attr("fill", Province_Background)
        .attr("d", self.path)
        .attr("path-name", d => d.properties.name)

      self.taiwan = map.append('g')
        .attr('class', 'taiwan')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .selectAll(".g-single-island")
        .data(taiwan.features)
        // .data(self.dataMap.features)
        .enter()
        .append("g")
        .attr('class', 'g-single-island')
        // .attr("id", d => "map-single-island-" + d.properties.id)
        .append("path")
        .attr("class", "taiwan-island")
        .attr("fill", Province_Background)
        .attr("d", self.path)
        .attr("path-name", d => d.properties.name)

      let layer_clone = map
        .append("g")
        .attr("id", "layer_clone")
      layer_clone.append('g').attr('class', 'layer_shadow').style('opacity', 1)
        .style('filter', 'url(#f-shadow-province')
      layer_clone.append('g').attr('class', 'layer_overlay')

      for (let i = 0; i < 34; i++) {
        cn.features[i].properties.cp = self.adjustCoordinate(cn.features[i].properties.name, cn.features[i].properties.cp)
      }

      // let MapTitle = self.svg.append("text")  //标题要覆盖在省份上方
      //     .attr('transform', `translate(${self.SvgWidth * 0.02},${self.SvgWidth * 0.02})`)
      //     .style("text-anchor", "start")
      //     .style("font-weight", "bold")
      //     .style("font-size", self.SvgWidth * 0.03)
      //     .style("fill", "black")

      // MapTitle.append('tspan')
      //     .attr("alignment-baseline","text-before-edge")
      //     .attr('class', 'timeheader')
      //     .text(self.TimeSlot.start + "-" + self.TimeSlot.end)

      // MapTitle.append('tspan')
      //     .attr('class', 'periodheader')
      //     .attr("x", 0)
      //     .attr("dy", self.SvgHeight * 8.0 / 100)
      //     .text("考古发现分布图")

      // MapTitle.append('tspan')
      //     .attr('class', 'numberheader')
      //     .attr("x", 0)
      //     .attr("dy", self.SvgHeight * 4.2 / 100)
      //     .text("共" + self.CurrentCount + "项")

      let w = 0.12 * self.SvgWidth;
      let h = w * 1.2
      let x = 0.90 * self.SvgWidth
      let y = 0.84  * self.SvgHeight
      self.Mapsvg.selectAll('#south-china-sea-canvas').remove()

      self.svg_nanhai = self.Mapsvg.append('g')
        .attr('id', "south-china-sea-canvas")
        .attr('transform', function () {
          return `translate(${x},${y})`
        })
        .attr('width', w)
        .attr('height', h)


      let islands_g = self.Mapsvg.append('g').attr('id', "islands")
        .attr('transform', function () {
          return `translate(${x},${y})`//上下需要同步修改
        })

      let canvas = islands_g.append('svg')
        .attr('id', "south-china-sea-islands-canvas")
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0)
        .style("overflow", "visible")
        .attr("viewBox", `-11 -18 115 130`)
        .attr('width', w)
        .attr('height', h)
      canvas.selectAll('path')
        .remove()

      canvas.append('defs').append("path").attr('id', "a").attr('d', function () {
          return "M.12.327h83.734v17.81H.12z"
      })

      canvas.append('g').attr('id', "south-china-sea-islands-canvas-paths")
        .attr("fill", "none")
        .attr("fill-rule", "evenodd")
        .selectAll('path')
        .data(global.icon.nanhai)
        .enter()
        .append('path')
        .style("stroke-width", "0.4 rem")
        .attr('fill', Country_Stroke)
        .attr('d', function (d) {
          return d
        })
        .attr('opacity', 1)

      self.renderSouthChinaSea(self.svg_nanhai, w, h, nanhai);
    },
    renderSouthChinaSea(svg_nanhai, w, h, nanhai) {
      let self = this
      let objArr = nanhai.features
      let min_edge = w
      let center_location = [114.4, 13.2]
      svg_nanhai.append("rect")
        .attr("id", "map_nanhai_box")
        .attr("width", w)
        .attr("height", h)
        .attr('fill', 'transparent')
        .attr('stroke', Province_Stroke)
        .attr('stroke-width', 0.003   * self.SvgWidth)

      svg_nanhai.append("clipPath") // define a clip path
        .attr("id", "clip-path-nanhai") // give the clipPath an ID
        .append("rect")
        .attr("width", w)
        .attr("height", h)
        .attr('fill', 'transparent')
      let range_nanhai = 3.3
      let projection_nanhai = d3.geoMercator()
        .center(center_location)
        .scale(min_edge * range_nanhai)
        .translate([w / 2, h / 2]);

      let path_nanhai = d3.geoPath().projection(projection_nanhai);
      let g_nanhai = svg_nanhai.append('g').attr('class', 'g-nanhai')
        .attr("clip-path", "url(#clip-path-nanhai)")

      g_nanhai.selectAll(".g-small-province")
        .data(objArr)
        .enter()
        .append("g")
        .attr('class', 'g-small-province')
        .attr("id", d => "map-small-province-" + d.properties.id)
        .append("path")
        .attr("class", "small-province")
        .attr("id", d => "map-path-small-" + self.Long2Short(d.properties.name))
        .attr("stroke", Province_Stroke)
        // .attr("stroke-width", 1)
        .attr("fill", function (d) {
          if (d.properties.name == '九段线')
            return 'transparent'
          return "#FFFFFF"
        })
        .attr('stroke-width', '0.1rem')
        .attr("d", path_nanhai)
        .attr("provinceName", d => d.properties.name)

      svg_nanhai.append("text")
        .attr("id", "map_nanhai_text")
        .style("fill", Country_Stroke)
        .attr("x", w)
        .attr("y", h)
        .text('南海诸岛')
        .style("font-size", w / 8)
        .attr('dx', -w * 0.03)
        .attr('dy', -h * 0.06)
        .attr('text-anchor', 'end')
    },

    Long2Short(a) {
      if (a == "内蒙古自治区")
        return "内蒙古"
      if (a == "黑龙江省")
        return "黑龙江"
      return a.slice(0, 2)
    },
    adjustCoordinate(provName, centerCoordinate) {
      if (provName == "河南省") {
        return [113.0668, 34.0818]; // [113.0668, 33.8818]
      }
      if (provName == "河北省") {
        return [115.35, 38.7];
      }
      if (provName == "内蒙古自治区") {
        return [111.65, 40.82];
      }
      if (provName == "陕西省") {
        return [108.44, 33.93];
      }
      if (provName == "甘肃省") {
        return [103.93333, 36.03333]; //[101.66, 38.25];
      }
      if (provName == "黑龙江省") {
        return [128.53, 47.01];
      }
      if (provName == "江苏省") {
        return [119.73, 33.12];
      }
      if (provName == "香港特别行政区") {
        return [114.37, 22.08]; //[115.12, 22.12];
      }
      if (provName == "澳门特别行政区") {
        return [113.54, 22.19];
      }
      if (provName == "广西壮族自治区") {
        return [108.0, 24.0];
      }
      if (provName == "广东省") {
        return [113.23, 23.16];
      }
      if (provName == "江西省") {
        return [115.5, 28.0];
      }
      if (provName == "上海市") {
        return [121.48, 31.62]; // [121.46485, 31.2671]
      }
      if (provName == "台湾省") {
        return [120.8254, 24.5986]; // [120.0254, 23.5986]
      }
      if (provName == "辽宁省") {
        return [122.8438, 41.5889]; // [122.0438, 41.0889]
      }
      if (provName == "北京市") {
        return [116.65, 40.72]; //[117.44, 38.83] // [117.48, 38.96] // [117.4219, 39.4189]
      }
      if (provName == "天津市") {
        return [117.49, 38.76]; //[117.44, 38.83] // [117.48, 38.96] // [117.4219, 39.4189]
      }
      if (provName == "重庆市") {
         return [107.7463, 29.8667]; // [106.6663, 29.5367]
      }
      if (provName == "云南省") {
        return [101.0652, 24.8007]; // [101.0652, 25.1807]
      }
      return centerCoordinate;
    },
  }
}

</script>
<style lang="less">

.Map {
  .Location{
      // stroke-width: 0.3rem !important;
      &.highlight{
        opacity: 1;
        stroke: red !important;
      }
      &.hidden_node{
        opacity: 0.1;
      }
  }
  .g-single-province.hidden_layer {
    opacity: 0.1;
    fill:transparent;
    transition: opacity 0s;
    &.active {
      transition: opacity 0s;
    }
  }
  .province-cityName-g{
      fill:#937857;
      visibility: hidden;
      &.active {
        visibility: visible;
      }
  }
  
  .g-map-province {
    stroke-opacity: 1;
    transition: stroke-opacity, fill-opacity, opacity 0s;
    fill-opacity: 1;
    &.active {
      fill-opacity: 1;
      stroke-opacity: 1;
      .city {
        stroke-opacity: 1;
      }
    }
    &.hidden_layer {
      opacity: 0.1;
    }
    .city {
      stroke-opacity: 0.35;
    }
  }

}
</style>
