<template>
  <div class="exploration">
    <div class="search-tool">
      <input type="text" ref="text" />
      <button @click="search" id="search-button"></button>
      <div class="filters">
        <div class="filter" id="batch" @click="showFilterOptions($event)">
          <p class="name">批次</p>
          <p class="value" val="">不限</p>
          <div class="down-arrow"></div>
          <div class="options">
            <ul>
              <li
                v-for="e in batches"
                :key="e.name"
                :val="e.value"
                v-text="e.name"
                @click.stop="choose"
              ></li>
            </ul>
          </div>
        </div>
        <div class="filter" id="language" @click="showFilterOptions($event)">
          <p class="name">文種</p>
          <p class="value" val="">不限</p>
          <div class="down-arrow"></div>
          <div class="options">
            <ul>
              <li
                v-for="e in languages"
                :key="e.name"
                :val="e.value"
                v-text="e.name"
                @click.stop="choose"
              ></li>
            </ul>
            <!-- <ul v-if="e.children" class="sub-list">
              <li v-for="ee in e.children" :key="ee.name" v-text="ee.name"></li>
            </ul> -->
          </div>
        </div>
        <div
          class="filter"
          id="dynasty_or_nation"
          @click="showFilterOptions($event)"
        >
          <p class="name">版本年代/国别</p>
          <p class="value" val="">不限</p>
          <div class="down-arrow"></div>
          <div class="options">
            <ul>
              <li
                v-for="e in dynasties"
                :key="e.name"
                :val="e.value"
                v-text="e.name"
                @click.stop="choose"
              ></li>
            </ul>
          </div>
        </div>
        <div
          class="filter"
          id="document_type"
          @click="showFilterOptions($event)"
        >
          <p class="name">文獻類型</p>
          <p class="value" val="">不限</p>
          <div class="down-arrow"></div>
          <div class="options">
            <ul>
              <li
                v-for="e in document_types"
                :key="e.name"
                :val="e.value"
                v-text="e.name"
                @click.stop="choose"
              ></li>
            </ul>
          </div>
        </div>
        <div class="filter" @click="showFilterOptions($event)">
          <p class="name">版本類型</p>
          <p class="value" val="">不限</p>
          <div class="down-arrow"></div>
          <div class="options">
            <ul>
              <li
                v-for="e in editions"
                :key="e.name"
                :val="e.value"
                v-text="e.name"
                @click.stop="choose"
              ></li>
            </ul>
          </div>
        </div>
        <div class="filter" @click="showFilterOptions($event)">
          <p class="name">相關人物</p>
          <p class="value">不限</p>
          <div class="down-arrow"></div>
          <div class="options"></div>
        </div>
        <div class="filter" @click="showFilterOptions($event)">
          <p class="name">收藏者</p>
          <p class="value">不限</p>
          <div class="down-arrow"></div>
          <div class="options"></div>
        </div>
      </div>
      <p class="total">共{{ search_result.length }}条结果</p>
      <div class="ranking" @click="rank">排序</div>
    </div>
    <div class="search-result">
      <div class="results results-plain" v-show="!relationship_mode">
        <table class="results-list">
          <tr>
            <th>ID</th>
            <th>規範題名</th>
            <th>名錄内容</th>
            <th>文獻類型</th>
            <th>文種</th>
            <th>收藏</th>
          </tr>
          <tr v-for="item in curr_d" :key="item.id" class="item-block">
            <td>
              <router-link
                v-text="item.id"
                :to="'/book-detail/' + item.id"
              ></router-link>
            </td>
            <td>
              <router-link
                v-text="item.content.split('　')[0]"
                :to="'/book-detail/' + item.id"
              ></router-link>
            </td>
            <td>
              <router-link
                v-text="item.content"
                :to="'/book-detail/' + item.id"
              ></router-link>
            </td>
            <td v-text="item.document_type"></td>
            <td v-text="item.language"></td>
            <td v-text="item.institution"></td>
          </tr>
        </table>
        <PageDivider
          @turnTo="alterPage"
          :items_sum="items_sum"
          :each_page_items="each_page_items"
        />
      </div>
      <div class="results results-relation" v-show="relationship_mode">
        <!-- 关系发现 -->
        <div class="graph" ref="graph-chart"></div>
      </div>
      <div class="toggle-view">
        <div
          @click="toggleRelationshipMode"
          :class="{ inactive: relationship_mode }"
        >
          古籍检索
        </div>
        <div
          @click="toggleRelationshipMode"
          :class="{ inactive: !relationship_mode }"
        >
          关系发现
        </div>
      </div>
    </div>
    <BookInfoDialog
      ref="book-info-dialog"
      :id="hover_data.id"
      :title="hover_data.title"
      :detail="hover_data.detail"
    />
  </div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";
import PageDivider from "@/components/PageDivider.vue";
import BookInfoDialog from "@/components/BookInfoDialog";
import * as Data from "@/data/dataLoader";

export default {
  name: "Exploration",
  components: { PageDivider, BookInfoDialog },
  data() {
    return {
      search_result: [], // 所有检索结果
      relationship_mode: false,
      curr_d: [], // 当前页的检索结果
      items_sum: 1,
      each_page_items: 50,
      batches: [
        { name: "不限", value: "" },
        { name: "第一批", value: 1 },
        { name: "第二批", value: 2 },
        { name: "第三批", value: 3 },
        { name: "第四批", value: 4 },
        { name: "第五批", value: 5 },
        { name: "第六批", value: 6 },
      ],
      languages: [
        { name: "不限", value: "" },
        { name: "漢文", value: "漢文" },
        {
          name: "少數民族文字",
          value: "少數民族文字",
          children: [
            { name: "多文種", value: "少數民族文字古籍/多文種" },
            { name: "焉耆—龜茲文", value: "焉耆—龜茲文" },
            { name: "于闐文", value: "于闐文" },
            { name: "藏文", value: "藏文" },
            { name: "回鶻文", value: "回鶻文" },
            { name: "西夏文", value: "西夏文" },
            { name: "白文", value: "白文" },
            { name: "蒙古文", value: "蒙古文" },
            { name: "察合臺文", value: "察合臺文" },
            { name: "彝文", value: "彝文" },
            { name: "滿文", value: "滿文" },
            { name: "東巴文", value: "東巴文" },
            { name: "傣文", value: "傣文" },
            { name: "水文", value: "水文" },
            { name: "古壯字", value: "古壯字" },
            { name: "布依文", value: "布依文" },
          ],
        },
        {
          name: "其他文字",
          value: "其他文字",
          children: [
            { name: "多文種", value: "其他文字古籍/多文種" },
            { name: "阿拉伯文", value: "阿拉伯文" },
            { name: "粟特文", value: "粟特文" },
            { name: "拉丁文", value: "拉丁文" },
            { name: "梵文", value: "梵文" },
            { name: "波斯文", value: "波斯文" },
            { name: "意大利文", value: "意大利文" },
            { name: "古敘利亞文", value: "古敘利亞文" },
            { name: "英文", value: "英文" },
            { name: "德文", value: "德文" },
          ],
        },
      ],
      document_types: [
        { name: "不限", value: "" },
        { name: "漢文古籍", value: "漢文古籍" },
        { name: "少數民族文字古籍", value: "少數民族文字古籍" },
        { name: "其他文字古籍", value: "其他文字古籍" },
        { name: "甲骨", value: "甲骨" },
        { name: "簡帛", value: "簡帛" },
        { name: "敦煌遺書", value: "敦煌遺書" },
        { name: "碑帖拓本", value: "碑帖拓本" },
        { name: "古地圖", value: "古地圖" },
      ],
      editions: [
        { name: "不限", value: "" },
        { name: "刻本", children: [{ name: "木刻" }, { name: "石刻" }] },
        { name: "稿本" },
        {
          name: "拓本",
          children: [{ name: "拓東庫本" }, { name: "拓泉州本" }],
        },
        {
          name: "印本",
          children: [
            { name: "公文紙印本" },
            { name: "朱墨套印本" },
            { name: "三色套印本" },
            { name: "套印本" },
            { name: "活字印本" },
            { name: "朱印本" },
            { name: "藍印本" },
            { name: "銅版印本" },
            { name: "鈐印本" },
            { name: "彩色套印本" },
            { name: "四色套印本" },
            { name: "銅活字印本" },
            { name: "官印本" },
            { name: "泥活字印本" },
            { name: "重印本" },
            { name: "五色套印本" },
            { name: "活字泥板印本" },
            { name: "木活字印本" },
            { name: "銅活字藍印本" },
            { name: "木刻朱印本" },
            { name: "木印本" },
            { name: "六色套印本" },
            { name: "朱墨印本" },
            { name: "鉛印本" },
          ],
        },
        {
          name: "繪本",
          children: [
            { name: "彩繪本" },
            { name: "手繪本" },
            { name: "摹繪本" },
            { name: "絹地繪本" },
            { name: "彩繪進呈本" },
            { name: "彩色摹繪本" },
            { name: "彩色絹繪本" },
          ],
        },
        {
          name: "活字本",
          children: [
            { name: "銅活字本" },
            { name: "木活字本" },
            { name: "泥活字本" },
          ],
        },
        { name: "修補本" },
        { name: "集配本" },
        { name: "印刷本" },
        { name: "重修本" },
        { name: "增修本" },
        { name: "補修本" },
        { name: "刺綉本" },
      ],
      dynasties: [
        { name: "不限", value: "" },
        { name: "戰國", value: "戰國" },
        { name: "秦", value: "秦" },
        { name: "漢", value: "漢" },
        { name: "西漢", value: "西漢" },
        { name: "東漢", value: "東漢" },
        { name: "三國", value: "三國" },
        { name: "北魏", value: "北魏" },
        { name: "東魏", value: "東魏" },
        { name: "南朝宋", value: "南朝宋" },
        { name: "南朝梁", value: "南朝梁" },
        { name: "齊", value: "齊" },
        { name: "隋", value: "隋" },
        { name: "唐", value: "唐" },
        { name: "晚唐", value: "晚唐" },
        { name: "十國後蜀", value: "十國後蜀" },
        { name: "五代", value: "五代" },
        { name: "後唐", value: "後唐" },
        { name: "十國", value: "十國" },
        { name: "五代宋初", value: "五代宋初" },
        { name: "宋", value: "宋" },
        { name: "宋元明清", value: "宋元明清" },
        { name: "西夏", value: "西夏" },
        { name: "西夏或元", value: "西夏或元" },
        { name: "北宋", value: "北宋" },
        { name: "南宋", value: "南宋" },
        { name: "宋蜀", value: "宋蜀" },
        { name: "大理國", value: "大理國" },
        { name: "金", value: "金" },
        { name: "遼", value: "遼" },
        { name: "元", value: "元" },
        { name: "元明", value: "元明" },
        { name: "明", value: "明" },
        { name: "南明", value: "南明" },
        { name: "明末清初", value: "明末清初" },
        { name: "明末", value: "明末" },
        { name: "清", value: "清" },
        { name: "太平天國", value: "太平天國" },
        { name: "民國", value: "民國" },
      ],
      graph_data: {},
      hover_data: {
        id: "",
        title: "",
        detail: "",
      },
    };
  },

  methods: {
    // 开始搜索。根据检索词及筛选条件
    search() {
      let batch = document.querySelector("#batch>.value").getAttribute("val"),
        language = document
          .querySelector("#language>.value")
          .getAttribute("val"),
        document_type = document
          .querySelector("#document_type>.value")
          .getAttribute("val"),
        edition_dynasty = document
          .querySelector("#dynasty_or_nation>.value")
          .getAttribute("val");
      axios
        .get(
          `/data/text?query=${this.$refs.text.value}&batch=${batch}&language=${language}&document_type=${document_type}&edition_dynasty=${edition_dynasty}`
        )
        .then((d) => {
          this.search_result = d.data;
          this.items_sum = d.data.length;
          this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据
          if (this.relationship_mode) this.renderGraphChart();
        });
    },
    rank() {
      console.log(this.search_result);
      this.search_result.sort((a, b) => b.id - a.id);
    },
    alterPage(page_index) {
      this.curr_d = this.search_result.slice(
        this.each_page_items * (page_index - 1),
        this.each_page_items * page_index
      ); // 当前页码的文件
    },
    showFilterOptions(e) {
      let b =
        e.currentTarget.querySelector(".options").style.display == "block";
      document
        .querySelectorAll(".options")
        .forEach((e) => (e.style.display = "none"));
      e.currentTarget.querySelector(".options").style.display = b
        ? "none"
        : "block";
    },
    choose(e) {
      document
        .querySelectorAll(".options")
        .forEach((e) => (e.style.display = "none"));
      let parent_filter_value = e.path[3].querySelector(".value");
      parent_filter_value.setAttribute(
        "val",
        e.currentTarget.getAttribute("val")
      );
      parent_filter_value.innerText = e.currentTarget.innerText;
    },
    toggleRelationshipMode() {
      this.relationship_mode = !this.relationship_mode;
      if (this.relationship_mode) this.renderGraphChart();
    },
    // 计算关系
    _calcGraphData() {
      let nodes = this.search_result.map(function (e) {
        return { id: e.id, group: 0 };
      });
      let _nodes = this.search_result.map(function (e) {
        return e.id;
      });
      let links = Data.get_relationship_list().filter(
        (e) => _nodes.indexOf(e.source) != -1 && _nodes.indexOf(e.target) != -1
      );
      this.graph_data = { nodes, links };
    },
    // 绘制关系
    renderGraphChart() {
      this._calcGraphData();
      let self = this;
      function ForceGraph(
        {
          nodes, // an iterable of node objects (typically [{id}, …])
          links, // an iterable of link objects (typically [{source, target}, …])
        },
        {
          nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
          nodeGroup, // given d in nodes, returns an (ordinal) value for color
          nodeGroups, // an array of ordinal values representing the node groups
          nodeTitle, // given d in nodes, a title string
          nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
          nodeStroke = "#fff", // node stroke color
          nodeStrokeWidth = 1.5, // node stroke width, in pixels
          nodeStrokeOpacity = 1, // node stroke opacity
          nodeRadius = 5, // node radius, in pixels
          nodeStrength = -1,
          linkSource = ({ source }) => source, // given d in links, returns a node identifier string
          linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
          linkStroke = "#999", // link stroke color
          linkStrokeOpacity = 0.6, // link stroke opacity
          linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
          linkStrokeLinecap = "round", // link stroke linecap
          linkStrength = 0.03,
          colors = d3.schemeTableau10, // an array of color strings, for the node groups
          width = 640, // outer width, in pixels
          height = 400, // outer height, in pixels
          invalidation, // when this promise resolves, stop the simulation
        } = {}
      ) {
        // Compute values.
        const N = d3.map(nodes, nodeId).map(intern);
        const LS = d3.map(links, linkSource).map(intern);
        const LT = d3.map(links, linkTarget).map(intern);
        if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
        // const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
        const G =
          nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
        const W =
          typeof linkStrokeWidth !== "function"
            ? null
            : d3.map(links, linkStrokeWidth);
        const L =
          typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

        // Replace the input nodes and links with mutable objects for the simulation.
        nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
        links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

        // Compute default domains.
        if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

        // Construct the scales.
        const color =
          nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

        // Construct the forces.
        const forceNode = d3.forceManyBody();
        const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
        if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
        if (linkStrength !== undefined) forceLink.strength(linkStrength);

        const simulation = d3
          .forceSimulation(nodes)
          .force("link", forceLink)
          .force("charge", forceNode)
          .force("center", d3.forceCenter())
          .on("tick", ticked);

        const svg = d3
          .create("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        const link = svg
          .append("g")
          .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
          .attr("stroke-opacity", linkStrokeOpacity)
          .attr(
            "stroke-width",
            typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
          )
          .attr("stroke-linecap", linkStrokeLinecap)
          .selectAll("line")
          .data(links)
          .join("line");

        const node = svg
          .append("g")
          .attr("fill", nodeFill)
          .attr("stroke", nodeStroke)
          .attr("stroke-opacity", nodeStrokeOpacity)
          .attr("stroke-width", nodeStrokeWidth)
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", nodeRadius)
          .attr("cursor", "pointer")
          .on("click", (e, d) => {
            self.$router.push(`/book-detail/${d.id}`);
          })
          .on("mouseenter", (e, d) => {
            self.hover_data = {
              id: d.id,
              title: self.$store.state.allData
                .find((elem) => elem.id == d.id)
                .content.split("　")[0],
              detail: self.$store.state.allData.find((elem) => elem.id == d.id)
                .detail,
            };
            self.$refs["book-info-dialog"].$el.style.display = "block";
          })
          .on("mousemove", (e) => {
            self.$refs["book-info-dialog"].$el.style.left =
              e.clientX + 10 + "px";
            self.$refs["book-info-dialog"].$el.style.top =
              e.clientY + 30 + "px";
          })
          .on("mouseleave", () => {
            self.$refs["book-info-dialog"].$el.style.display = "none";
          })
          .call(drag(simulation));

        if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
        if (L) link.attr("stroke", ({ index: i }) => L[i]);
        if (G) node.attr("fill", ({ index: i }) => color(G[i]));
        // if (T) node.append("title").text(({ index: i }) => T[i]);
        if (invalidation != null) invalidation.then(() => simulation.stop());

        function intern(value) {
          return value !== null && typeof value === "object"
            ? value.valueOf()
            : value;
        }

        function ticked() {
          link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

          node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        }

        function drag(simulation) {
          function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          }

          function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          }

          function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }

          return d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
        }

        return Object.assign(svg.node(), { scales: { color } });
      }
      let chart = ForceGraph(this.graph_data, {
        nodeId: (d) => d.id,
        nodeGroup: (d) => d.group,
        nodeTitle: (d) => `${d.id}\n${d.group}`,
        linkStrokeWidth: (l) => Math.sqrt(l.value),
        width: this.$refs["graph-chart"].parentNode.parentNode.offsetWidth,
        height: this.$refs["graph-chart"].parentNode.parentNode.offsetHight,
        // invalidation, // a promise to stop the simulation when the cell is re-run
      });
      this.$refs["graph-chart"].innerHTML = "";
      this.$refs["graph-chart"].append(chart);
    },
  },
  mounted() {
    axios.get(`/data/text?query=`).then((d) => {
      this.search_result = d.data;
      this.items_sum = d.data.length;
      this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据
    });
  },
};
</script>

<style lang="less" scoped>
.exploration {
  font-size: 0.8rem;
  width: 100vw;
  height: 100vh;
  padding: 2rem 5rem;
  box-sizing: border-box;
  // background: linear-gradient(#b8a885, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #b8a885);
  .search-tool {
    input[type="text"] {
      height: 2rem;
      width: 15rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      outline: none;
      vertical-align: top; // 防错位
    }
    #search-button {
      background: #fbb03b url(../assets/icons/search.svg) center no-repeat;
      background-size: 66%;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      margin: 0 0 0 0.7rem;
    }
    #search-button:hover {
      filter: brightness(80%);
    }

    .filters {
      display: flex;
      justify-content: space-between;
      .filter {
        position: relative;
        background: #4a3300;
        border-radius: 0.5rem;
        text-align: center;
        padding: 0.3rem 1rem;
        flex: 1 1 auto;
        margin: 0.5rem 0.7rem;
        color: #fff;
        user-select: none;
        cursor: pointer;
        .name {
          font-weight: bold;
        }
        .value {
          font-size: 0.7rem;
        }
        .down-arrow {
          border: 0.3rem solid transparent;
          border-top-color: #a8742f;
          border-bottom-width: 0;
          width: 0;
          margin: 0.3rem auto 0;
        }
        ::-webkit-scrollbar {
          width: 0.5rem;
        }
        ::-webkit-scrollbar-track {
          -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: #ccc;
          -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
        }
        .options {
          position: absolute;
          left: 0;
          top: 3.7rem;
          width: 100%;
          border-radius: 0.5rem;
          background: #333;
          z-index: 100;
          max-height: 40vmax;
          overflow-y: scroll;
          display: none;
          font-size: 0.7rem;
          ul {
            margin: 0 0 0 0.5rem;
            list-style-type: none;
            li {
              padding: 0.4rem 0;
              .sub-list {
                position: absolute;
              }
            }
            li:hover {
              background: #666;
            }
          }
        }
      }
      .filter:first-child {
        margin-left: 0;
      }
      .filter:last-child {
        margin-right: 0;
      }
    }
  }
  .search-result {
    position: relative;
    .results {
      background: #42210b11;
      height: 60vh;
      overflow-y: scroll;
      table.results-list {
        font-size: 0.7rem;
        border-collapse: collapse;
        .item-block {
          td {
            text-align: center;
            padding: 4px 8px;
            a {
              text-decoration: none;
              color: #4a0400;
            }
            a:hover {
              text-decoration: underline;
            }
          }
          td:nth-of-type(2) {
            font-size: 0.8rem;
          }
          td:nth-of-type(3) {
            width: 25rem;
            text-align: left;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
        }
        .item-block:nth-child(2n + 1) {
          background: #42210b12;
        }
        .item-block:hover {
          background-color: #ccc;
        }
      }
    }

    .toggle-view {
      position: absolute;
      top: 5rem;
      right: -1.6rem;
      div {
        width: 1rem;
        font-size: 0.8rem;
        text-align: center;
        background: #42210b11;
        padding: 0.8rem 0.3rem;
        user-select: none;
        cursor: pointer;
      }
      div:nth-child(1) {
        border-top-right-radius: 0.5rem;
      }
      div:nth-child(2) {
        border-bottom-right-radius: 0.5rem;
      }
      div.inactive {
        background: #4a3300;
        color: #fff;
      }
    }
  }
}
</style>
