<template>
  <div class="relationship">
    <div class="left">
      <div class="search">
        <input placeholder="默認按全字段檢索" type="text" ref="text" />
        <button id="search-button" @click="search"></button>
        <button>?</button>
      </div>
      <div class="results results-relation">
        <div class="graph" ref="graph-chart"></div>
      </div>
    </div>
    <div class="right">
      <div class="nodes-list">
        <h4>節點列表</h4>
        <ul>
          <li
            v-for="n in node_list"
            :name="n.id"
            :key="n.id"
            v-text="n.name"
          ></li>
        </ul>
      </div>
      <div class="relationship-detail">
        <h4>關係内容</h4>
        <ul>
          <li v-for="r in relation_list" :key="r">
            <router-link :to="'/book-detail/' + convertBookId(r.book_id)">
              <div>
                <span v-text="r.book_id"></span>
                <span
                  v-text="getBookInfoById(r.book_id).content.split(`　`)[0]"
                ></span>
              </div>
              <div>
                <span v-text="getPersonInfoById(r.person1_id).name"></span
                ><span
                  v-text="'[' + getActionInfoById(r.action1_id).name + ']'"
                ></span
                >-- <span v-text="getPersonInfoById(r.person2_id).name"></span
                ><span
                  v-text="'[' + getActionInfoById(r.action2_id).name + ']'"
                ></span>
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

export default {
  name: "Relationship",
  data() {
    return {
      graph_data: { nodes: [], links: [] },
      curr_nodes: [],
      curr_links: [],
      curr_relation: null,
    };
  },
  computed: {
    node_list: function () {
      let arr = [];
      this.curr_nodes.forEach((e) => {
        arr.push(this.$store.state.persons.find((ele) => ele.id == e.id));
      });
      return arr;
    },
    relation_list: function () {
      let arr = [];
      if (this.curr_relation) {
        arr = `${
          this.getPersonInfoById(this.curr_relation.source.id).name
        } -- ${this.getPersonInfoById(this.curr_relation.target.id).name}`;

        let r = this.$store.state.person_ralations.filter(
          (e) =>
            (e.person1_id == this.curr_relation.source.id &&
              e.person2_id == this.curr_relation.target.id) ||
            (e.person2_id == this.curr_relation.source.id &&
              e.person1_id == this.curr_relation.target.id)
        );
        arr = r;
      }

      return arr;
    },
  },
  methods: {
    convertBookId(id) {
      let t = "00000".split("");
      let id_str = "" + id;
      for (let i = id_str.length - 1; i >= 0; i--) {
        t[i] = id_str[i];
      }
      return t.join("");
    },
    getPersonInfoById(id) {
      return this.$store.state.persons.find((e) => e.id == id);
    },
    getBookInfoById(id) {
      return this.$store.state.books.find(
        (e) => e.id == this.convertBookId(id)
      );
    },
    getActionInfoById(id) {
      return this.$store.state.actions.find((e) => e.id == id);
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
            ele.value = 5; // 点的大小。临时赋值
          });
          this.curr_nodes = d.data[0];
          this.curr_links = d.data[1];
          res();
        });
      });
    },
    intern(value) {
      return value !== null && typeof value === "object"
        ? value.valueOf()
        : value;
    },
    forceGraph(
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
        nodeRadius = 10, // node radius, in pixels
        nodeStrength = -0.8, // 斥力
        linkSource = ({ source }) => source, // given d in links, returns a node identifier string
        linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
        linkStroke = "#999",
        linkStrokeOpacity = 0.6, // link stroke opacity
        linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength = 0.08, // 相互連接的點的引力
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
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
      const G =
        nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(this.intern);
      const W =
        typeof linkStrokeWidth !== "function"
          ? null
          : d3.map(links, linkStrokeWidth);
      const L =
        typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
      const R =
        typeof nodeRadius != "function" ? null : d3.map(nodes, nodeRadius);

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
        .join("line")
        .attr("cursor", "pointer")
        .on("click", (_, d) => {
          console.log(d);
          this.curr_relation = d;
        });
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
        .on("click", (e, d) => {
          console.log(e, d);
          // self.$router.push(`/person-detail/${d.id}`);
        })
        // .on("mouseenter", (e, d) => {
        //   self.hover_data = {
        //     id: d.id,
        //     title: self.$store.state.books.find((elem) => elem.id == d.id).content.split("　")[0],
        //     detail: self.$store.state.books.find((elem) => elem.id == d.id).detail,
        //   };
        //   self.$refs["book-info-dialog"].$el.style.display = "block";
        // })
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

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
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
        linkStrokeWidth: (l) => Math.sqrt(l.value),
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
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.relationship {
  width: 100vw;
  height: 100vh;
  padding: 2rem 5rem;
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
      #search-button:hover {
        filter: brightness(80%);
      }
    }
  }

  .right {
    flex: 30% 1 1;
    .nodes-list {
      ul {
        font-size: 0.7rem;
        list-style: none;
        overflow-y: scroll;
        height: 13rem;
        li {
          cursor: pointer;
        }
        li:hover {
          background: #3333;
        }
      }
    }
    .relationship-detail {
      ul {
        font-size: 0.7rem;
        list-style: none;
        overflow-y: scroll;
        height: 13rem;
        li {
          cursor: pointer;
        }
        li:hover {
          background: #3333;
        }
      }
    }
  }
}
</style>
