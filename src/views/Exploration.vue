<template>
  <div class="exploration">
    <div class="search-tool">
      <input type="text" ref="text" />
      <button @click="search" id="search-button"></button>
      <div class="filters">
        <div class="filter" id="batch">
          <p class="name">批次</p>
          <p class="value">第一批</p>
          <div></div>
        </div>
        <div class="filter" id="language">
          <p class="name">文種</p>
          <p class="value">汉文</p>
          <div></div>
        </div>
        <div class="filter" id="time">
          <p class="name">出版時代</p>
          <p class="value">明</p>
          <div></div>
        </div>
        <div class="filter" id="document_type">
          <p class="name">文獻類型</p>
          <p class="value">汉文古籍</p>
          <div></div>
        </div>
        <div class="filter">
          <p class="name">版本類型</p>
          <p class="value">刻本</p>
          <div></div>
        </div>
        <div class="filter">
          <p class="name">相關人物</p>
          <p class="value">黄丕烈</p>
          <div></div>
        </div>
        <div class="filter">
          <p class="name">收藏者</p>
          <p class="value">国家图书馆</p>
          <div></div>
        </div>
      </div>
      <p class="total">共{{ search_result.length }}条结果</p>
      <div class="ranking">排序</div>
    </div>
    <div class="search-result">
      <div class="results results-plain" v-if="!relationship_mode">
        <table class="results-list">
          <tr>
            <th>ID</th>
            <th>名錄内容</th>
            <th>文獻類型</th>
            <th>文種</th>
            <th>收藏</th>
          </tr>
          <tr v-for="item in search_result" :key="item.id" class="item-block">
            <td><router-link v-text="item.id" :to="'/book-detail/' + item.id"></router-link></td>
            <td><router-link v-text="item.content" :to="'/book-detail/' + item.id"></router-link></td>
            <td v-text="item.document_type"></td>
            <td v-text="item.language"></td>
            <td v-text="item.institution"></td>
          </tr>
        </table>
      </div>
      <div class="results results-relation" v-if="relationship_mode"></div>
      <div class="toggle-view">
        <div @click="relationship_mode = false" :class="{ inactive: relationship_mode }">古籍检索</div>
        <div @click="relationship_mode = true" :class="{ inactive: !relationship_mode }">关系发现</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Exploration",
  data() {
    return {
      relationship_mode: false,
      search_result: [],
    };
  },
  methods: {
    search() {
      axios.get(`/data/text/${this.$refs.text.value}`).then((d) => {
        this.search_result = d.data;
      });
    },
    // toDetail(book_id) {
    //   this.$router.push(`/book-detail/${book_id}`);
    // },
  },
};
</script>

<style lang="less" scoped>
.exploration {
  font-size: 0.8rem;
  width: 100vw;
  height: 100vh;
  background: #f2e0c4;
  padding: 2rem 5rem;
  box-sizing: border-box;
  // background: linear-gradient(#b8a885, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #b8a885);
  .search-tool {
    input[type="text"] {
      height: 2rem;
      width: 15rem;
      border-radius: 0.5rem;
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

    .filters {
      display: flex;
      justify-content: space-between;
      .filter {
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
        div {
          border: 0.3rem solid transparent;
          border-top-color: #a8742f;
          border-bottom-width: 0;
          width: 0;
          margin: 0.3rem auto 0;
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
      min-height: 50vh;
      max-height: 90vh;
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
            width: 600px;
            text-align: left;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
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
