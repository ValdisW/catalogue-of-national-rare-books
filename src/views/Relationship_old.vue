<template>
  <div class="relationship" v-if="complete">
    <div class="left">
      <!-- 檢索工具 -->
      <div class="search">
        <input
          type="text"
          value="資治通鑒"
          ref="text"
          @keyup="
            (e) => {
              if (e.key == 'Enter') search();
            }
          "
        />
        <!-- <Droplist ref="drop-list" :attr_list="display_attrs" /> -->
        <button id="search-button" :class="{ invalid: wait }" @click="search"></button>
        <button id="tip-button">
          <div id="tip-content">
            通過檢索古籍題名，挖掘古籍書目和人物之間的關聯。節點代表人物，節點之間的連線是指兩個人物共同創作、出版或收藏過同一本書。
            <br />
            <br />
            在檢索“資治通鑒”的情況下：點擊一個節點（人物），與之相關的節點將在“相關人物”中列出，並標記了其所參與過的與“資治通鑒”相關的古籍數量；點擊一條連線，則在“相關古籍”中顯示所連接的兩個節點（人物）共同參與的古籍。
          </div>
          <div class="arrow"></div>
        </button>
      </div>

      <!-- 關係圖 -->
      <div class="results results-relation">
        <div class="graph" ref="svg-wrapper"></div>
      </div>
    </div>

    <div class="right">
      <div class="list nodes-list">
        <h4>相關人物</h4>
        <ul ref="nodes-list">
          <li
            v-for="n in node_list"
            :name="n.id"
            :key="n.id"
            v-text="`${n.name}(${n.curr_books})`"
            :class="[`n${n.id}`, { active: n.active }]"
            @mouseover="nodeHighlight(n.id, false)"
          ></li>
        </ul>
      </div>
    </div>

    <div ref="tooltip" class="tooltip" v-show="show_tooltip">
      <h5 v-text="selected_info.name"></h5>
      <span @click="openPersonDetail(selected_info.id)">查看人物詳情</span>
    </div>

    <div class="list relationship-detail" ref="relationship-detail" v-show="show_relationship_detail">
      <h4>相關古籍</h4>
      <ul>
        <li v-for="r in relation_list" :key="r" @click="openBookDetail(convertBookId(r.book_id))">
          <!-- 古籍信息 -->
          <div class="book">
            <span v-text="convertBookId(r.book_id)"></span>
            <span v-text="getBookNameById(convertBookId(r.book_id))"></span>
          </div>

          <!-- 人物信息 -->
          <div class="person">
            <span class="name" v-text="getPersonNameById(r.person1_id)"></span
            ><span class="action" v-text="getActionNameById(r.action1_id)"></span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="name" v-text="getPersonNameById(r.person2_id)"></span
            ><span class="action" v-text="getActionNameById(r.action2_id)"></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import axios from "axios";
// import Droplist from "@/components/Droplist";

export default {
  name: "Relationship",
  // components: { Droplist },
  data() {
    return {
      complete: false,
      graph_data: { nodes: [], links: [] },
      curr_nodes: [],
      curr_links: [],
      curr_relation: null,
      wait: false, // 点击搜索按钮的等待，防止重复点击
      display_attrs: [
        { name: "題名", value: "book_name" },
        { name: "人名", value: "person_name" },
      ],
      show_tooltip: false,
      show_relationship_detail: false,
      selected_id: 0,
      selected_info: {},
    };
  },
  computed: {
    node_list: function () {
      let arr = [];
      this.curr_nodes.forEach((e) => {
        let item = this.$store.state.persons.find((ele) => ele.id == e.id);
        item.active = false;
        item.curr_books = e.books;
        arr.push(item);
      });
      arr.sort((a, b) => b.curr_books - a.curr_books);
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
      return arr;
    },
  },
  watch: {
    selected_id(value) {
      this.selected_info = this.$store.state.persons.find((ele) => ele.id == value);
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
      if (r) return r.name;
      else return "未知书名";
    },
    getActionNameById(id) {
      let r = this.$store.state.all_action.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知行为";
    },
    openBookDetail(id) {
      this.$emit("openBookDetail", id);
    },
    openPersonDetail(id) {
      this.$emit("openPersonDetail", id);
    },
    search() {
      // 按书名检索
      // if (this.$refs["drop-list"].curr_value == "book_name")
      if (!this.wait) {
        this.wait = true;
        axios
          .get(`/data/person?text=${this.$refs.text.value}`)
          .then((d) => {
            d.data[0].forEach((ele) => {
              // ele.value = 1.5 + Math.sqrt(ele.books); // 点的大小
              ele.value = 3 + ele.books / 3; // 点的大小
            });
            this.curr_nodes = d.data[0];
            this.curr_links = d.data[1];
            this.wait = false;
          })
          .then(() => {
            this.renderGraphChart({
              nodes: this.curr_nodes,
              links: this.curr_links,
            });
          });
        // 按人名检索
        // else if (this.$refs["drop-list"].curr_value == "person_name")
        //   axios
        //     .get(`/data/person-relationship?text=${this.$refs.text.value}`)
        //     .then((d) => {
        //       d.data[0].forEach((el) => {
        //         el.related = 0;
        //         el.value = 1.5 + Math.sqrt(el.books); // 点的大小
        //       });
        //       d.data[1].forEach((el) => {
        //         el.related = 1;
        //         el.value = 1.5 + Math.sqrt(el.books); // 点的大小
        //       });

        //       this.curr_nodes = d.data[0].concat(d.data[1]);
        //       this.curr_links = d.data[2];
        //     })
        //     .then(() => {
        //       this.renderGraphChart({
        //         nodes: this.curr_nodes,
        //         links: [],
        //       });
        //     });
      }
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
        nodeGroup, // given d in nodes, returns an (ordinal) value for color
        nodeGroups, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#201D1D", // 點的描邊顔色
        nodeStrokeWidth = 1.2, // 點的描邊寬度
        nodeStrokeOpacity = 1, // 點的描邊的不透明度
        nodeRadius = 10, // 點的直徑
        linkSource = ({ source }) => source, // given d in links, returns a node identifier string
        linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
        linkStroke = "#C4A1A199", // 邊的顔色
        linkStrokeOpacity = 1.0, // 邊的不透明度
        linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        // nodeStrength = -2.1, // 斥力
        // linkStrength = 0.02, // 連綫的引力
        nodeStrength = 0, // 斥力
        linkStrength = 0, // 連綫的引力
        colors = ["#76978F"], // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 640, // outer height, in pixels
        invalidation, // when this promise resolves, stop the simulation
      } = {}
    ) {
      // Compute values.
      const N = d3.map(nodes, (d) => d.id).map(this.intern);
      const LS = d3.map(links, linkSource).map(this.intern);
      const LT = d3.map(links, linkTarget).map(this.intern);
      if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
      // const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(this.intern);
      const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
      const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
      const R = typeof nodeRadius != "function" ? null : d3.map(nodes, nodeRadius);

      // Replace the input nodes and links with mutable objects for the simulation.
      nodes = d3.map(nodes, (_, i) => ({ id: N[i], value: nodes[i].value }));
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
        .force(
          "collide",
          d3.forceCollide().radius((e) => e.value * 1.5 + 3)
        )
        .force("center", d3.forceCenter())
        .on("tick", ticked);

      // 创建画布
      const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height]);
      // .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

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
        .attr("class", (d) => `l-${d.index}`)
        .on("click", (e, d) => {
          e.stopPropagation();
          d3.selectAll("circle").attr("fill", colors[0]);
          d3.select(`circle.n${d.source.id}`).attr("fill", "#FBB03B");
          d3.select(`circle.n${d.target.id}`).attr("fill", "#FBB03B");

          d3.selectAll("line").attr("stroke", linkStroke);
          d3.select(`line.l-${d.index}`).attr("stroke", "#FBB03B99");

          this.show_relationship_detail = true;
          this.show_tooltip = false;

          this.curr_relation = d;

          this.$refs["relationship-detail"].style.left = `${e.clientX + 40}px`;
          this.$refs["relationship-detail"].style.top = `${e.clientY - 40}px`;
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
        .on("click", (e, d) => {
          e.stopPropagation();
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

      // 滚轮缩放
      svg.on("wheel", (e) => {
        this.show_tooltip = false;
        this.show_relationship_detail = false;

        let scale = e.deltaY / 2e3;

        let [x, y, w, h] = svg.attr("viewBox").split(",");

        let nw = Number(w) * scale;
        let nh = Number(h) * scale;

        x = Number(x) - (e.offsetX / svg.attr("width")) * nw;
        y = Number(y) - (e.offsetY / svg.attr("height")) * nh;
        w = Number(w) + nw;
        h = Number(h) + nh;

        svg.attr("viewBox", [x, y, w, h].toString());
      });

      // 拖拽交互
      let mousedown = false;

      svg.on("click", () => {
        this.show_tooltip = false;
        this.show_relationship_detail = false;
      });

      svg.on("mousedown", () => {
        mousedown = true;
      });

      svg.on("mousemove", (e) => {
        if (mousedown) {
          this.show_tooltip = false;
          this.show_relationship_detail = false;
          let [x, y, w, h] = svg.attr("viewBox").split(",");
          x = Number(x) - e.movementX;
          y = Number(y) - e.movementY;
          svg.attr("viewBox", [x, y, w, h].toString());
        }
      });

      svg.on("mouseup", () => {
        mousedown = false;
      });

      // 拖拽交互
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
      this.$refs["svg-wrapper"].innerHTML = "";
      this.$refs["svg-wrapper"].append(
        this.forceGraph(graph_data, {
          nodeId: (d) => d.id,
          nodeGroup: (d) => d.group,
          nodeTitle: (d) => `${d.id}\n${d.group}`,
          nodeRadius: (d) => d.value,
          linkStrokeWidth: (l) => Math.sqrt(l.value) + 1,
          width: this.$refs["svg-wrapper"].parentNode.parentNode.offsetWidth,
          height: this.$refs["svg-wrapper"].parentNode.parentNode.offsetHeight,
          // invalidation, // a promise to stop the simulation when the cell is re-run
        })
      );
    },

    nodeHighlight(node_id, scroll) {
      this.selected_id = node_id;
      this.show_relationship_detail = false;
      this.show_tooltip = true;
      this.node_list.forEach((e) => (e.active = false));
      this.node_list.find((e) => e.id == node_id).active = true;
      d3.selectAll(`circle`).attr("fill", "#76978F");
      d3.selectAll("line").attr("stroke", "#C4A1A199");
      d3.select(`circle.n${node_id}`).attr("fill", "#FBB03B");
      let box = document.querySelector(`circle.n${node_id}`).getBoundingClientRect();

      this.$refs.tooltip.style.left = `${box.x + 40}px`;
      this.$refs.tooltip.style.top = `${box.y - 40}px`;

      if (scroll) document.querySelector(`li.n${node_id}`).scrollIntoView({ behavior: "smooth" });
    },
  },
  mounted() {
    axios.get("/data/relationship-load").then((res) => {
      this.$store.commit("loadRelationshipData", res.data);

      this.complete = true;
      this.$emit("endLoading");

      this.$nextTick(() => {
        this.search();
      });
    });
  },
  unmounted() {
    this.$emit("startLoading");
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
      display: flex;
      align-items: center;
      input[type="text"] {
        border: 0.1rem solid #201d1d;
        padding: 0 0 0 0.3rem;
        width: 15rem;
        height: 2rem;
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
        &:hover {
          filter: brightness(80%);
        }
      }
      #search-button.invalid {
        background: #ccc url(../assets/icons/search.svg) center no-repeat;
        background-size: 66%;
        cursor: unset;
      }
      #tip-button {
        background: #45a1bb url(../assets/icons/tip.svg) center no-repeat;
        position: relative;
        background-size: 80%;
        width: 2rem;
        height: 2rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        margin: 0 0 0 0.7rem;
        #tip-content {
          display: none;
        }
        &:hover {
          background-color: #3a869c;
          .arrow {
            border: 0.7rem solid #333;
            border-top-width: 0;
            border-left: 0.5rem solid transparent;
            border-right: 0.5rem solid transparent;
            position: absolute;
            top: 2.2rem;
            left: 0.5rem;
          }
          #tip-content {
            display: block;
            position: absolute;
            top: 2.8rem;
            left: -50%;
            font-size: 0.6rem;
            background: #333;
            color: #efefef;
            box-sizing: border-box;
            padding: 0.6rem;
            width: 14rem;
            text-align: left;
          }
        }
      }
    }
    .results-relation {
      margin: 0.8rem 1.2rem 0 0;
      .graph {
        height: 78vh;
        width: 100%;
        overflow: hidden;
        background: #3331;
        // border-radius: 0.5rem;
      }
    }
  }

  .right {
    flex: 30% 1 1;
    .list {
      box-sizing: border-box;
      padding: 0.5rem;
      // border-radius: 0.5rem;
      h4 {
        margin: 0 0 0.3rem;
      }
    }
    .nodes-list {
      background: #3331;
      ul {
        font-size: 0.7rem;
        list-style: none;
        overflow-y: scroll;
        height: 79vh;
        li {
          cursor: pointer;
          padding: 0.15rem 0;
        }
        li:hover {
          background: #3333;
        }
        li.active {
          background: #3333;
        }
      }
    }
  }

  .tooltip {
    position: absolute;
    background: #333;
    width: 8rem;
    height: 5rem;
    top: 0;
    left: 0;
    z-index: 10;
    box-sizing: border-box;
    padding: 1rem;
    // border-radius: 0.3rem;
    h5 {
      color: #efefef;
    }
    span {
      color: #efefef;
      font-size: 0.7rem;
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .relationship-detail {
    position: absolute;
    padding: 0.5rem;
    background: #333;
    h4 {
      color: #efefef;
    }
    ul {
      color: #efefef;
      font-size: 0.7rem;
      list-style: none;
      overflow-y: scroll;
      height: 9.3rem;
      li {
        padding: 0.3rem 0;
        cursor: pointer;
        .book {
          // font-size: 0.7rem;
          span:nth-child(1) {
            color: rgb(168, 124, 79);
            margin: 0 0.2rem 0 0;
          }
          margin: 0 0 0.1rem;
        }
        .person {
          .name {
            margin: 0 0.1rem 0 0;
          }
          .action {
            background: #b0a1b8;
            color: #eee;
            padding: 0 0.1rem;
            border-radius: 0.1rem;
          }
        }
      }
      li:hover {
        background: #555;
      }
      // li:nth-child(2n + 1) {
      //   background: #42210b0a;
      // }
      // li:nth-child(2n) {
      //   background: #42210b14;
      // }
    }
  }
}
</style>
