<template>
  <div class="exploration">
    <div class="search">
      <!-- 檢索框 -->
      <input placeholder="請輸入關鍵詞" type="text" ref="text" />

      <!-- 檢索字段 -->
      <Droplist ref="drop-list" :attr_list="display_attrs" />

      <!-- 檢索按鈕 -->
      <button id="search-button" @click="search"></button>
    </div>

    <div class="main-content">
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
        <p class="total">共{{ search_result.length }}條結果</p>
        <div class="results results-plain">
          <table class="results-list">
            <thead>
              <tr>
                <th
                  v-for="e in display_attrs"
                  :key="e.name"
                  @click="toggleRank(e.value, e.order)"
                >
                  <span class="attr-title" v-text="e.name"></span>
                  <span class="rank">
                    <span></span>
                    <span></span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in curr_d"
                :key="item.id"
                class="item-block"
                @click="$emit('openBookDetail', item.id)"
              >
                <td v-text="item.id"></td>
                <td v-text="item.batch"></td>
                <td v-text="item.name"></td>
                <td
                  v-text="
                    $store.state.all_edition_dynasty.find(
                      (ele) => ele.id == item.edition_dynasty_id
                    )
                      ? $store.state.all_edition_dynasty.find(
                          (ele) => ele.id == item.edition_dynasty_id
                        ).name
                      : '-'
                  "
                ></td>
                <td
                  v-text="
                    $store.state.all_document_type.find(
                      (ele) => ele.id == item.document_type_id
                    )
                      ? $store.state.all_document_type.find(
                          (ele) => ele.id == item.document_type_id
                        ).name
                      : '-'
                  "
                ></td>
                <td
                  v-text="
                    $store.state.all_language.find(
                      (ele) => ele.id == item.language_id
                    )
                      ? $store.state.all_language.find(
                          (ele) => ele.id == item.language_id
                        ).name
                      : '-'
                  "
                ></td>
                <td
                  v-text="
                    $store.state.all_institution.find(
                      (ele) => ele.id == item.institution_id
                    )
                      ? $store.state.all_institution.find(
                          (ele) => ele.id == item.institution_id
                        ).name
                      : '-'
                  "
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
        <PageDivider
          @turnTo="alterPage"
          :items_sum="items_sum"
          :each_page_items="each_page_items"
          ref="page-divider"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PageDivider from "@/components/PageDivider.vue";
import Filter from "@/components/Filter";
import Droplist from "@/components/Droplist";

export default {
  name: "Exploration",
  components: { PageDivider, Filter, Droplist },
  data() {
    return {
      curr_attr: "id", // 當前檢索字段
      search_result: [], // 所有检索结果
      curr_d: [], // 当前页的检索结果
      items_sum: 1,
      each_page_items: 50, // 每頁的檢索結果數量

      // 筛选器数据
      filter_data: [
        { id: "language", name: "文種", value: [] },
        { id: "edition_dynasty", name: "版本年代", value: [] },
        { id: "document_type", name: "文獻類型", value: [] },
        { id: "edition_type", name: "版本類型", value: [] },
      ],

      filtered_result: [], // 筛选后的结果

      // 展示字段与检索字段
      display_attrs: [
        { name: "ID", value: "id", order: true, byID: false },
        { name: "批次", value: "batch", order: true, byID: false },
        { name: "題名", value: "name", order: true, byID: false },
        { name: "版本年代", value: "edition_dynasty", order: true, byID: true },
        { name: "文獻類型", value: "document_type", order: true, byID: true },
        { name: "文種", value: "language", order: true, byID: true },
        { name: "收藏單位", value: "institution", order: true, byID: true },
      ],
    };
  },
  methods: {
    // 开始搜索。根据检索词及筛选条件
    search() {
      axios
        .get(
          `/data/text?query=${this.$refs.text.value}&attr=${this.$refs["drop-list"].curr_value}`
        )
        .then((d) => {
          this.search_result = d.data;
          this.items_sum = d.data.length;
          this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据
          this.updateFilter();
        });
    },
    updateFilter() {
      for (let i in this.filter_data)
        this.filter_data[i].value = this.getSum(
          this.search_result,
          this.filter_data[i].id + "_id"
        );
    },
    filterResult(e) {
      this.filtered_result = this.search_result.filter(
        (ele) => ele[e.attr + "_id"] == e.value
      );
      this.curr_d = this.filtered_result.slice(0, this.each_page_items); // 当前页数据
      console.log(e, this.filtered_result);
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
      this.display_attrs.find((e) => e.value == attr).order =
        !this.display_attrs.find((e) => e.value == attr).order;
      this.$refs["page-divider"].turnTo(1);
    },
    alterPage(page_index) {
      this.curr_d = this.search_result.slice(
        this.each_page_items * (page_index - 1),
        this.each_page_items * page_index
      );
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
  },
  mounted() {
    this.search_result = this.$store.state.books;
    this.items_sum = this.$store.state.books.length;
    this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据

    this.updateFilter();
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
                  display: block;
                  border: 0.3rem solid #3333;
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
</style>
