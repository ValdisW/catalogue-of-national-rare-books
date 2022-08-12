<template>
  <div class="exploration">
    <div class="search">
      <input placeholder="根据任意字段检索" type="text" ref="text" />
      <button @click="search" id="search-button"></button>
    </div>
    <div class="main-content">
      <div class="filters">
        <Filter v-for="e in filters" :key="e" title="版本類型" :attrName="e" />
      </div>

      <div class="search-result">
        <p class="total">共{{ search_result.length }}条结果</p>
        <div class="results results-plain">
          <table class="results-list">
            <tr>
              <th>ID</th>
              <th>批次</th>
              <th>題名</th>
              <th>版本年代</th>
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
              <td v-text="item.batch"></td>
              <td>
                <router-link
                  v-text="item.content.split('　')[0]"
                  :to="'/book-detail/' + item.id"
                ></router-link>
              </td>
              <td v-text="item.edition_dynasty"></td>
              <td v-text="item.document_type"></td>
              <td v-text="item.language"></td>
              <td v-text="item.institution"></td>
            </tr>
          </table>
        </div>
        <PageDivider
          @turnTo="alterPage"
          :items_sum="items_sum"
          :each_page_items="each_page_items"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PageDivider from "@/components/PageDivider.vue";
import Filter from "@/components/Filter";

export default {
  name: "Exploration",
  components: { PageDivider, Filter },
  data() {
    return {
      search_result: [], // 所有检索结果
      curr_d: [], // 当前页的检索结果
      items_sum: 1,
      each_page_items: 50,
      hover_data: {
        id: "",
        title: "",
        detail: "",
      },
      filters: ["languages", "dynasties", "document_types", "edition_types"],
    };
  },
  methods: {
    // 开始搜索。根据检索词及筛选条件
    search() {
      // let batch = document.querySelector("#batch>.value").getAttribute("val"),
      //   language = document.querySelector("#language>.value").getAttribute("val"),
      //   document_type = document.querySelector("#document_type>.value").getAttribute("val"),
      //   edition_dynasty = document.querySelector("#dynasty_or_nation>.value").getAttribute("val");
      axios.get(`/data/text?query=${this.$refs.text.value}`).then((d) => {
        this.search_result = d.data;
        this.items_sum = d.data.length;
        this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据
        console.log(this.search_result);

        // 更新筛选器
        this.filters.forEach((e) => {
          this.getSum(this.search_result, e);
        });
      });
    },
    getSum(r, attr) {
      let a = {};
      r.forEach((e) => {
        a[e[attr]] = a[e[attr]] || 0;
        a[e[attr]]++;
      });
      return a;
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
    .search-result {
      position: relative;
      .results {
        background: #42210b11;
        height: 60vh;
        overflow-y: scroll;

        table.results-list {
          width: 100%;
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
            td:nth-of-type(3) {
              font-size: 0.8rem;
            }
            // td:nth-of-type(4) {
            //   width: 25rem;
            //   text-align: left;

            //   display: -webkit-box;
            //   -webkit-box-orient: vertical;
            //   -webkit-line-clamp: 3;
            //   overflow: hidden;
            // }
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
