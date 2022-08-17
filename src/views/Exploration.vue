<template>
  <div class="exploration">
    <div class="search">
      <!-- 檢索框 -->
      <input placeholder="請輸入關鍵詞" type="text" ref="text" />

      <!-- 檢索字段 -->
      <Droplist :attr_list="display_attrs" />

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
              <tr v-for="item in curr_d" :key="item.id" class="item-block">
                <td>
                  <router-link v-text="item.id" :to="'/book-detail/' + item.id"></router-link>
                </td>
                <td v-text="item.batch"></td>
                <td>
                  <router-link v-text="item.content.split('　')[0]" :to="'/book-detail/' + item.id"></router-link>
                </td>
                <td v-text="item.edition_dynasty"></td>
                <td v-text="item.document_type"></td>
                <td v-text="item.language"></td>
                <td v-text="item.institution"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <PageDivider @turnTo="alterPage" :items_sum="items_sum" :each_page_items="each_page_items" ref="page-divider" />
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
      filter_data: [
        { id: "language", name: "文種", value: [] },
        { id: "edition_dynasty", name: "版本年代", value: [] },
        { id: "document_type", name: "文獻類型", value: [] },
      ],
      display_attrs: [
        { name: "ID", value: "id", order: true },
        { name: "批次", value: "batch", order: true },
        { name: "題名", value: "", order: true },
        { name: "版本年代", value: "edition_dynasty", order: true },
        { name: "文獻類型", value: "document_type", order: true },
        { name: "文種", value: "language", order: true },
        { name: "收藏單位", value: "institution", order: true },
      ],
      filtered_result: [],
    };
  },
  methods: {
    // 开始搜索。根据检索词及筛选条件
    search() {
      // let batch = document.querySelector("#batch>.value").getAttribute("val"),
      //   language = document.querySelector("#language>.value").getAttribute("val"),
      //   document_type = document.querySelector("#document_type>.value").getAttribute("val"),
      //   edition_dynasty = document.querySelector("#dynasty_or_nation>.value").getAttribute("val");
      axios.get(`/data/text?query=${this.$refs.text.value}&attr=`).then((d) => {
        this.search_result = d.data;
        this.items_sum = d.data.length;
        this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据
        this.updateFilter();
      });
    },
    updateFilter() {
      for (let i in this.filter_data)
        this.filter_data[i].value = this.getSum(this.search_result, this.filter_data[i].id);
    },
    filterResult(e) {
      this.filtered_result = this.search_result.filter((ele) => {
        ele[e.attr] == e.value;
      });
      console.log(this.search_result);
      console.log(this.filtered_result);
      this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据
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
            background-color: #ccc;
          }
        }
      }
    }
  }
}
</style>
