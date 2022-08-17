<template>
  <div class="relationship">
    <div class="left">
      <!-- 檢索工具 -->
      <div class="search">
        <input placeholder="默認按全字段檢索" type="text" value="朱" ref="text" />
        <Droplist :attr_list="display_attrs" />
        <button id="search-button" @click="search"></button>
        <button id="tip-button"></button>
      </div>

      <!-- 關係圖 -->
      <div class="results results-relation">
        <div class="graph" ref="graph-chart"></div>
      </div>
    </div>

    <div class="right">
      <div class="list nodes-list">
        <h4>節點列表</h4>
        <ul ref="nodes-list">
          <li
            v-for="n in node_list"
            :name="n.id"
            :key="n.id"
            v-text="n.name"
            :class="[`n${n.id}`, { active: n.active }]"
            @mouseover="nodeHighlight(n.id, false)"
          ></li>
        </ul>
      </div>
      <div class="list relationship-detail">
        <h4>關係内容</h4>
        <ul>
          <!-- <li v-for="r in relation_list" :key="r">
            <router-link :to="'/book-detail/' + convertBookId(r.book_id)" v-text="r"></router-link>
          </li> -->
          <li v-for="r in relation_list" :key="r">
            <router-link :to="'/book-detail/' + convertBookId(r.book_id)">
              <div>
                <span v-text="convertBookId(r.book_id)"></span>
                <span v-text="getBookNameById(convertBookId(r.book_id))"></span>
              </div>
              <div>
                <span v-text="getPersonNameById(r.person1_id)"></span
                ><span v-text="'[' + getActionNameById(r.action1_id) + ']'"></span>--
                <span v-text="getPersonNameById(r.person2_id)"></span
                ><span v-text="'[' + getActionNameById(r.action2_id) + ']'"></span>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
// import * as Data from "@/data/dataLoader";
import axios from "axios";
import Droplist from "@/components/Droplist";

export default {
  name: "Relationship",
  components: { Droplist },
  data() {
    return {
      graph_data: { nodes: [], links: [] },
      curr_nodes: [],
      curr_links: [],
      curr_relation: null,
      display_attrs: [
        { name: "人名", value: "person_name" },
        { name: "书名", value: "book_name" },
      ],
    };
  },
  computed: {
    node_list: function () {
      let arr = [];
      this.curr_nodes.forEach((e) => {
        let item = this.$store.state.persons.find((ele) => ele.id == e.id);
        item.active = false;
        arr.push(item);
      });
      return arr;
    },
    relation_list: function () {
      let arr = [];
      if (this.curr_relation) {
        arr = `${this.getPersonNameById(this.curr_relation.source.id)} -- ${this.getPersonNameById(
          this.curr_relation.target.id
        )}`;

        let r = this.$store.state.person_ralations.filter(
          (e) =>
            (e.person1_id == this.curr_relation.source.id && e.person2_id == this.curr_relation.target.id) ||
            (e.person2_id == this.curr_relation.source.id && e.person1_id == this.curr_relation.target.id)
        );
        arr = r;
      }
      console.log(arr);
      return arr;
    },
  },
  methods: {
    convertBookId(id) {
      let t = "00000".split("");
      let id_str = "" + id;
      for (let i = 0; i < id_str.length; i++) {
        t[t.length - id_str.length + i] = id_str[i];
      }
      return t.join("");
    },
    getPersonNameById(id) {
      let r = this.$store.state.persons.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知人名";
    },
    getBookNameById(id) {
      let r = this.$store.state.books.find((e) => e.id == this.convertBookId(id));
      if (r) return r.content.split(`　`)[0];
      else return "未知书名";
    },
    getActionNameById(id) {
      let r = this.$store.state.actions.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知行为";
    },
    search() {
      // 先测试一下，按人名来检索
      this.draw();
    },

    // 计算关系
    getGraphData() {
      return new Promise((res) => {
        axios.get(`/data/person?text=${this.$refs.text.value}`).then((d) => {
          d.data[0].forEach((ele) => {
            ele.value = 1.5 + Math.sqrt(ele.books); // 点的大小
          });
          this.curr_nodes = d.data[0];
          this.curr_links = d.data[1];
          res();
        });
      });
    },
    intern(value) {
      return value !== null && typeof value === "object" ? value.valueOf() : value;
    },
    forceGraph(
      {
        nodes, // 節點列表 (typically [{id}, …])
        links, // 邊表 (typically [{source, target}, …])
      },
      {
        nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup, // given d in nodes, returns an (ordinal) value for color
        nodeGroups, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#000", // 點的描邊顔色
        nodeStrokeWidth = 1.2, // 點的描邊寬度
        nodeStrokeOpacity = 1, // 點的描邊的不透明度
        nodeRadius = 10, // 點的直徑
        nodeStrength = -1.4, // 斥力
        linkSource = ({ source }) => source, // given d in links, returns a node identifier string
        linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
        linkStroke = "#B8A4A4", // 邊的顔色
        linkStrokeOpacity = 1.0, // 邊的不透明度
        linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.07, // 連綫的引力
        colors = ["#93A7A7"], // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 640, // outer height, in pixels
        invalidation, // when this promise resolves, stop the simulation
      } = {}
    ) {
      // let self = this;
      // Compute values.
      const N = d3.map(nodes, nodeId).map(this.intern);
      const LS = d3.map(links, linkSource).map(this.intern);
      const LT = d3.map(links, linkTarget).map(this.intern);
      if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
      // const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(this.intern);
      const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
      const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
      const R = typeof nodeRadius != "function" ? null : d3.map(nodes, nodeRadius);

      // Replace the input nodes and links with mutable objects for the simulation.
      nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
      links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

      // Compute default domains.
      if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

      // Construct the scales.
      const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

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

      // 创建画布
      const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

      // 添加连线
      const link = svg
        .append("g")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("cursor", "pointer")
        .on("click", (_, d) => {
          this.curr_relation = d;
        });

      // 添加结点
      const node = svg
        .append("g")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", typeof nodeRadius != "function" ? nodeRadius : null)
        .attr("cursor", "pointer")
        .attr("class", (d) => `n${d.id}`)
        .on("mouseenter", (e, d) => {
          this.nodeHighlight(d.id, true);
        })
        // .on("mousemove", (e) => {
        //   self.$refs["book-info-dialog"].$el.style.left = e.clientX + 10 + "px";
        //   self.$refs["book-info-dialog"].$el.style.top = e.clientY + 30 + "px";
        // })
        // .on("mouseleave", () => {
        //   self.$refs["book-info-dialog"].$el.style.display = "none";
        // })
        .call(drag(simulation));

      if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (G) node.attr("fill", ({ index: i }) => color(G[i]));
      if (R) node.attr("r", ({ index: i }) => R[i]);
      // if (T) node.append("title").text(({ index: i }) => T[i]);
      if (invalidation != null) invalidation.then(() => simulation.stop());

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

        return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
      }

      return Object.assign(svg.node(), { scales: { color } });
    },

    // 绘制关系
    renderGraphChart(graph_data) {
      let chart = this.forceGraph(graph_data, {
        nodeId: (d) => d.id,
        nodeGroup: (d) => d.group,
        nodeTitle: (d) => `${d.id}\n${d.group}`,
        nodeRadius: (d) => d.value,
        linkStrokeWidth: (l) => Math.sqrt(l.value) + 1,
        width: this.$refs["graph-chart"].parentNode.parentNode.offsetWidth,
        height: this.$refs["graph-chart"].parentNode.parentNode.offsetHight,
        // invalidation, // a promise to stop the simulation when the cell is re-run
      });
      this.$refs["graph-chart"].innerHTML = "";
      this.$refs["graph-chart"].append(chart);
    },

    draw() {
      this.getGraphData().then(() => {
        this.renderGraphChart({
          nodes: this.curr_nodes,
          links: this.curr_links,
        });
      });
    },

    nodeHighlight(node_id, scroll) {
      this.node_list.forEach((e) => (e.active = false));
      this.node_list.find((e) => e.id == node_id).active = true;
      d3.selectAll(`circle`).attr("fill", "#93A7A7");
      d3.select(`circle.n${node_id}`).attr("fill", "#fc1");
      if (scroll) document.querySelector(`li.n${node_id}`).scrollIntoView({ behavior: "smooth" });
    },
  },
  mounted() {
    this.search();
  },
};
</script>

<style lang="less" scoped>
.relationship {
  width: 100vw;
  height: 100vh;
  padding: 3rem 5rem;
  box-sizing: border-box;
  display: flex;
  .left {
    flex: 70% 1 1;
    .search {
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
      #tip-button {
        background: #45a1bb url(../assets/icons/tip.svg) center no-repeat;
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
    }
    .results-relation {
      margin: 0.8rem 1.2rem 0 0;
      .graph {
        background: #3331;
        border-radius: 0.5rem;
      }
    }
  }

  .right {
    flex: 30% 1 1;
    .list {
      box-sizing: border-box;
      padding: 0.5rem;
      background: #3331;
      border-radius: 0.5rem;
      h4 {
        margin: 0 0 0.3rem;
      }
    }
    .nodes-list {
      ul {
        font-size: 0.7rem;
        list-style: none;
        overflow-y: scroll;
        height: 18rem;
        li {
          cursor: pointer;
          padding: 0.1rem 0;
        }
        li:hover {
          background: #3333;
        }
        li.active {
          background: #3333;
        }
      }
    }
    .relationship-detail {
      margin: 1.2rem 0 0;
      ul {
        font-size: 0.7rem;
        list-style: none;
        overflow-y: scroll;
        height: 9.3rem;
        li {
          cursor: pointer;
          a {
            color: #333;
          }
        }
        li:hover {
          background: #3333;
        }
      }
    }
  }
}
</style>
