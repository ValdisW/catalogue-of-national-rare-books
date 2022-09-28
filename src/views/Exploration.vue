<template>
  <div class="exploration" :class="{ new: !show_results }" v-if="complete">
    <div class="search" :class="{ new: !show_results }">
      <SearchBar :attr_list="display_attrs" @search="search" />
    </div>

    <div class="main-content" v-show="show_results">
      <!-- 左側篩選欄 -->
      <div class="filters">
        <Filter
          v-for="e in filter_data"
          :key="e"
          :attr_name="e.name"
          :attr_id="e.id"
          :attrs="e.value"
          @filter="filterResult"
        />
      </div>

      <!-- 右側檢索結果 -->
      <div class="search-result">
        <p class="total">共{{ has_filtered ? filtered_result.length : search_result.length }}條結果</p>
        <div class="results results-plain">
          <table class="results-list">
            <thead>
              <tr>
                <th v-for="e in display_attrs" :key="e.name" @click="toggleRank(e.value, e.order)">
                  <span class="attr-title" v-text="e.name"></span>
                  <span class="rank">
                    <span></span>
                    <span></span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in curr_d" :key="item.id" class="item-block" @click="$emit('openBookDetail', item)">
                <td v-text="'第' + item.batch + '批'"></td>
                <td v-text="item.id || '-'"></td>
                <td v-text="item.name || '-'"></td>
                <td v-text="item.edition || '-'"></td>
                <td
                  v-text="
                    $store.state.all_edition_dynasty.find((ele) => ele.id == item.edition_dynasty_id)
                      ? $store.state.all_edition_dynasty.find((ele) => ele.id == item.edition_dynasty_id).name
                      : '-'
                  "
                ></td>
                <td
                  v-text="
                    $store.state.all_document_type.find((ele) => ele.id == item.document_type_id)
                      ? $store.state.all_document_type.find((ele) => ele.id == item.document_type_id).name
                      : '-'
                  "
                ></td>
                <td
                  v-text="
                    $store.state.all_language.find((ele) => ele.id == item.language_id)
                      ? $store.state.all_language.find((ele) => ele.id == item.language_id).name
                      : '-'
                  "
                ></td>
                <td
                  v-text="
                    $store.state.all_institution.find((ele) => ele.id == item.institution_id)
                      ? $store.state.all_institution.find((ele) => ele.id == item.institution_id).name
                      : '-'
                  "
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
        <PageDivider
          @turnTo="alterPage"
          :items_sum="has_filtered ? filtered_result.length : search_result.length"
          :each_page_items="each_page_items"
          ref="page-divider"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import PageDivider from "@/components/PageDivider";
import Filter from "@/components/Filter";

export default {
  name: "Exploration",
  components: { SearchBar, PageDivider, Filter },
  data() {
    return {
      complete: false,
      show_results: false,
      search_result: [], // 所有检索结果
      curr_d: [], // 当前页的检索结果
      each_page_items: 50, // 每页的检索结果数量

      curr_filter: {}, // 当前的筛选条件

      has_filtered: false, // 标记是否已经进行过筛选（用于正确显示检索结果数量以及页码数）

      // 筛选器数据
      filter_data: [
        { id: "language", name: "文種", value: [] },
        { id: "document_type", name: "文獻類型", value: [] },
        { id: "edition_dynasty", name: "版本年代", value: [] },
        { id: "edition_type", name: "版本類型", value: [] },
      ],

      filtered_result: [], // 筛选后的结果

      // 展示字段与检索字段
      display_attrs: [
        { name: "名録批次", value: "batch", order: true, byID: false },
        { name: "名録號", value: "id", order: true, byID: false },
        { name: "題名", value: "name", order: true, byID: false },
        { name: "版本", value: "edition", order: true, byID: true },
        { name: "版本年代", value: "edition_dynasty", order: true, byID: true },
        { name: "文獻類型", value: "document_type", order: true, byID: true },
        { name: "文種", value: "language", order: true, byID: true },
        { name: "收藏單位", value: "institution", order: true, byID: true },
      ],
    };
  },
  methods: {
    // 开始检索。根据检索词及筛选条件
    search(values) {
      console.log(values);
      axios
        .post("/data/search-for-books", { values })
        .then((res) => {
          this.search_result = res.data;
          this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据
          this.updateFilter();
          this.show_results = true;
        })
        .then((err) => {
          if (err) console.error(err);
        });
    },
    // 更新统计数据
    updateFilter() {
      for (let i in this.filter_data)
        this.filter_data[i].value = this.getSum(this.search_result, this.filter_data[i].id + "_id");
    },
    // Filter发生变化
    filterResult(e) {
      this.curr_filter[e.attr] = e.value;
      console.log(this.curr_filter);
      this.filtered_result = this.search_result.filter((el) => {
        let flag = true;
        for (let i in this.curr_filter) {
          if (!this.curr_filter[i].length) continue;
          let _flag = false;
          for (let v of this.curr_filter[i]) _flag = _flag || "" + el[i + "_id"] == v;
          flag = flag && _flag;
        }
        return flag;
      });
      this.curr_d = this.filtered_result.slice(0, this.each_page_items); // 当前页数据
      this.has_filtered = true;
    },
    getSum(r, attr) {
      let a = {};
      r.forEach((e) => {
        a[e[attr]] = a[e[attr]] || 0;
        a[e[attr]]++;
      });
      let arr = [];
      for (let i in a) {
        arr.push({
          name: i,
          value: a[i],
          selected: false,
        });
      }
      return arr;
    },
    toggleRank(attr, order) {
      if (order) {
        this.search_result.sort((a, b) => {
          let flag;
          if (typeof a[attr] == "string") flag = b[attr].localeCompare(a[attr]);
          else if (typeof a[attr] == "number") flag = b[attr] - a[attr];
          else flag = 1;
          return flag;
        });
      } else {
        this.search_result.sort((a, b) => {
          let flag;
          if (typeof a[attr] == "string") flag = a[attr].localeCompare(b[attr]);
          else if (typeof a[attr] == "number") flag = a[attr] - b[attr];
          else flag = 1;
          return flag;
        });
      }
      this.display_attrs.find((e) => e.value == attr).order = !this.display_attrs.find((e) => e.value == attr).order;
      this.$refs["page-divider"].turnTo(1);
    },
    alterPage(page_index) {
      this.curr_d = this.search_result.slice(
        this.each_page_items * (page_index - 1),
        this.each_page_items * page_index
      );
    },
    showFilterOptions(e) {
      let b = e.currentTarget.querySelector(".options").style.display == "block";
      document.querySelectorAll(".options").forEach((e) => (e.style.display = "none"));
      e.currentTarget.querySelector(".options").style.display = b ? "none" : "block";
    },
    choose(e) {
      document.querySelectorAll(".options").forEach((e) => (e.style.display = "none"));
      let parent_filter_value = e.path[3].querySelector(".value");
      parent_filter_value.setAttribute("val", e.currentTarget.getAttribute("val"));
      parent_filter_value.innerText = e.currentTarget.innerText;
    },
  },
  mounted() {
    axios.get("/data/exploration-load").then((res) => {
      this.$store.commit("loadExplorationData", res.data);

      this.complete = true;
      this.$emit("endLoading");

      this.filtered_result = this.search_result = this.$store.state.books;
      this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据

      this.updateFilter();
    });
  },
  unmounted() {
    this.$emit("startLoading");
  },
};
</script>

<style lang="less" scoped>
.exploration {
  font-size: 0.8rem;
  width: 100vw;
  height: 100vh;
  padding: 3rem 5rem;
  box-sizing: border-box;
  // background: linear-gradient(#b8a885, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #b8a885);
  .search.new {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .main-content {
    display: flex;
    margin: 0.3rem 0 0;
    .filters {
      margin: 0 0.7rem 0 0;
    }
    .search-result {
      flex: auto 1 1;
      position: relative;
      .results {
        background: #42210b11;
        height: 70vh;
        overflow-y: scroll;
        margin: 0 0 0.6rem;
        table.results-list {
          width: 100%;
          font-size: 0.7rem;
          border-collapse: collapse;
          thead {
            height: 1.5rem;
            th {
              cursor: pointer;
              .attr-title {
              }
              .rank {
                display: inline-block;
                width: 0.6rem;
                height: 0.6rem;
                margin: 0 0 0 0.2rem;
                span {
                  width: 0;
                  display: block;
                  border: 0.23rem solid #3333;
                  border-left-color: transparent;
                  border-right-color: transparent;
                }
                span:nth-child(1) {
                  border-top-width: 0;
                  margin: 0 0 0.1rem;
                }
                span:nth-child(2) {
                  border-bottom-width: 0;
                }
              }
            }
          }

          tr.item-block {
            user-select: none;
            cursor: pointer;
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
            td:nth-of-type(3) {
              font-size: 0.8rem;
            }
          }
          .item-block:nth-child(2n + 1) {
            background: #42210b12;
          }
          .item-block:hover {
            background: #29150733;
          }
        }
      }
    }
  }
}
.exploration.new {
  background: url(../assets/bookshelf_texture.png) no-repeat center;
  background-size: auto 80%;
}
</style>
