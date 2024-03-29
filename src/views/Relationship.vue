<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { getRelByBookName, loadRelationshipData } from "@/api";
import { useStore } from "@/store";
import * as d3 from "d3";
// import Droplist from "@/components/Droplist";

const store = useStore();
const emit = defineEmits([
  "endLoading",
  "startLoading",
  "openBookDetail",
  "openPersonDetail",
]);

const complete = ref(false);
const graph_data = { nodes: [], links: [] };
const curr_nodes = ref([]);
const curr_links = ref([]);
const curr_relation = ref(null);
const wait = ref(false); // 点击搜索按钮的等待，防止重复点击
const display_attrs = [
  { name: "題名", value: "book_name" },
  { name: "人名", value: "person_name" },
];
const show_tooltip = ref(false);
const show_relationship_detail = ref(false);
const selected_id = ref(0);
const selected_info = ref({});

const textRef = ref<HTMLInputElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);
const svgWrapperRef = ref<HTMLElement | null>(null);
const relationshipDetailRef = ref<HTMLElement | null>(null);

watch(selected_id, (value) => {
  selected_info.value = store.persons.find((ele) => ele.id == value);
});

const node_list = computed(function () {
  let arr = [];
  curr_nodes.value.forEach((e) => {
    let item = store.persons.find((ele) => ele.id == e.id);
    item.active = false;
    item.curr_books = e.books;
    arr.push(item);
  });
  arr.sort((a, b) => b.curr_books - a.curr_books);
  return arr;
});

const relation_list = computed(function () {
  let arr = [];
  if (curr_relation.value) {
    arr = `${getPersonNameById(curr_relation.value.source.id)} -- ${getPersonNameById(curr_relation.value.target.id)}`;

    let r = store.person_ralations.filter(
      (e) =>
        (e.person1_id == curr_relation.value.source.id &&
          e.person2_id == curr_relation.value.target.id) ||
        (e.person2_id == curr_relation.value.source.id &&
          e.person1_id == curr_relation.value.target.id),
    );
    arr = r;
  }
  return arr;
});

function convertBookId(id) {
  let t = "00000".split("");
  let id_str = "" + id;
  for (let i = 0; i < id_str.length; i++) {
    t[t.length - id_str.length + i] = id_str[i];
  }
  return t.join("");
}

function getPersonNameById(id) {
  let r = store.persons.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知人名";
}

function getBookNameById(id) {
  let r = store.books.find((e) => e.id == convertBookId(id));
  if (r) return r.name;
  else return "未知书名";
}

function getActionNameById(id) {
  let r = store.all_action.find((e) => e.id == id);
  if (r) return r.name;
  else return "未知行为";
}

function openBookDetail(id) {
  emit("openBookDetail", id);
}

function openPersonDetail(id) {
  emit("openPersonDetail", id);
}

function search() {
  // 按书名检索
  // if (this.$refs["drop-list"].curr_value == "book_name")
  if (!wait.value) {
    wait.value = true;
    getRelByBookName(textRef.value.value)
      .then((d) => {
        d.data[0].forEach((ele) => {
          // ele.value = 1.5 + Math.sqrt(ele.books); // 点的大小
          ele.value = 3 + ele.books / 3; // 点的大小
        });
        curr_nodes.value = d.data[0];
        curr_links.value = d.data[1];
        wait.value = false;
      })
      .then(() => {
        renderGraphChart({
          nodes: curr_nodes.value,
          links: curr_links.value,
        });
      });
  }
}

function intern(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

function forceGraph(
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
  } = {},
) {
  // Compute values.
  const N = d3.map(nodes, (d) => d.id).map(intern);
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
  // const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  const W =
    typeof linkStrokeWidth !== "function"
      ? null
      : d3.map(links, linkStrokeWidth);
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
      d3.forceCollide().radius((e) => e.value * 1.5 + 3),
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
    .attr(
      "stroke-width",
      typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null,
    )
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

      show_relationship_detail.value = true;
      show_tooltip.value = false;

      curr_relation.value = d;

      relationshipDetailRef.value.style.left = `${e.clientX + 40}px`;
      relationshipDetailRef.value.style.top = `${e.clientY - 40}px`;
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
      nodeHighlight(d.id, true);
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
    show_tooltip.value = false;
    show_relationship_detail.value = false;

    let scale = e.deltaY / 2e3;

    let [x, y, w, h] = svg.attr("viewBox").split(",");

    let nw = Number(w) * scale;
    let nh = Number(h) * scale;

    x = Number(x) - (e.offsetX / svg.attr("width")) * nw;
    y = Number(y) - (e.offsetY / svg.attr("height")) * nh;
    w = Number(w) + nw;
    h = Number(h) + nh;
    console.log([x, y, w, h]);

    svg.attr("viewBox", [x, y, w, h].toString());
  });

  // 拖拽交互
  let mousedown = false;

  svg.on("click", () => {
    show_tooltip.value = false;
    show_relationship_detail.value = false;
  });

  svg.on("mousedown", () => {
    mousedown = true;
  });

  svg.on("mousemove", (e) => {
    if (mousedown) {
      show_tooltip.value = false;
      show_relationship_detail.value = false;
      let [x, y, w, h] = svg.attr("viewBox").split(",");
      x = Number(x) - e.movementX;
      y = Number(y) - e.movementY;
      console.log([x, y, w, h]);
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

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return Object.assign(svg.node(), { scales: { color } });
}

// 绘制关系
function renderGraphChart(graph_data) {
  svgWrapperRef.value.innerHTML = "";
  svgWrapperRef.value.append(
    forceGraph(graph_data, {
      nodeId: (d) => d.id,
      nodeGroup: (d) => d.group,
      nodeTitle: (d) => `${d.id}\n${d.group}`,
      nodeRadius: (d) => d.value,
      linkStrokeWidth: (l) => Math.sqrt(l.value) + 1,
      width: svgWrapperRef.value.parentNode.parentNode.offsetWidth,
      height: svgWrapperRef.value.parentNode.parentNode.offsetHeight,
      // invalidation, // a promise to stop the simulation when the cell is re-run
    }),
  );
}

function nodeHighlight(node_id, scroll) {
  selected_id.value = node_id;
  show_relationship_detail.value = false;
  show_tooltip.value = true;
  node_list.value.forEach((e) => (e.active = false));
  node_list.value.find((e) => e.id == node_id).active = true;
  d3.selectAll(`circle`).attr("fill", "#76978F");
  d3.selectAll("line").attr("stroke", "#C4A1A199");
  d3.select(`circle.n${node_id}`).attr("fill", "#FBB03B");
  let box = document
    .querySelector(`circle.n${node_id}`)
    .getBoundingClientRect();

  tooltipRef.value.style.left = `${box.x + 40}px`;
  tooltipRef.value.style.top = `${box.y - 40}px`;

  if (scroll)
    document
      .querySelector(`li.n${node_id}`)
      .scrollIntoView({ behavior: "smooth" });
}

onMounted(() => {
  loadRelationshipData().then((res) => {
    store.loadRelationshipData(res.data);

    complete.value = true;
    emit("endLoading");
    // search();
    nextTick(() => {
      search();
    });
  });
});

onUnmounted(() => {
  emit("startLoading");
});
</script>

<template>
  <div class="relationship" v-if="complete">
    <div class="left">
      <!-- 檢索工具 -->
      <div class="search">
        <input
          type="text"
          value="資治通鑒"
          ref="textRef"
          @keyup="
            (e) => {
              if (e.key == 'Enter') search();
            }
          "
        />
        <!-- <Droplist ref="drop-list" :attr_list="display_attrs" /> -->
        <button
          id="search-button"
          :class="{ invalid: wait }"
          @click="search"
        ></button>
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
        <div class="graph" ref="svgWrapperRef"></div>
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

    <div ref="tooltipRef" class="tooltip" v-show="show_tooltip">
      <h5 v-text="selected_info.name"></h5>
      <span @click="openPersonDetail(selected_info.id)">查看人物詳情</span>
    </div>

    <div
      class="list relationship-detail"
      ref="relationshipDetailRef"
      v-show="show_relationship_detail"
    >
      <h4>相關古籍</h4>
      <ul>
        <li
          v-for="r in relation_list"
          :key="r"
          @click="openBookDetail(convertBookId(r.book_id))"
        >
          <!-- 古籍信息 -->
          <div class="book">
            <span v-text="convertBookId(r.book_id)"></span>
            <span v-text="getBookNameById(convertBookId(r.book_id))"></span>
          </div>

          <!-- 人物信息 -->
          <div class="person">
            <span class="name" v-text="getPersonNameById(r.person1_id)"></span
            ><span
              class="action"
              v-text="getActionNameById(r.action1_id)"
            ></span
            >&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="name" v-text="getPersonNameById(r.person2_id)"></span
            ><span
              class="action"
              v-text="getActionNameById(r.action2_id)"
            ></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

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
