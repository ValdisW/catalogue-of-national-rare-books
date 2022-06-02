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
              <li v-for="e in batches" :key="e.name" :val="e.value" v-text="e.name" @click.stop="choose"></li>
            </ul>
          </div>
        </div>
        <div class="filter" id="language" @click="showFilterOptions($event)">
          <p class="name">文種</p>
          <p class="value" val="">不限</p>
          <div class="down-arrow"></div>
          <div class="options">
            <ul>
              <li v-for="e in languages" :key="e.name" :val="e.value" v-text="e.name" @click.stop="choose"></li>
            </ul>
            <!-- <ul v-if="e.children" class="sub-list">
              <li v-for="ee in e.children" :key="ee.name" v-text="ee.name"></li>
            </ul> -->
          </div>
        </div>
        <div class="filter" id="time" @click="showFilterOptions($event)">
          <p class="name">出版時代</p>
          <p class="value" val="">不限</p>
          <div class="down-arrow"></div>
          <div class="options">
            <ul>
              <li v-for="e in dynasties" :key="e.name" :val="e.value" v-text="e.name" @click.stop="choose"></li>
            </ul>
          </div>
        </div>
        <div class="filter" id="document_type" @click="showFilterOptions($event)">
          <p class="name">文獻類型</p>
          <p class="value" val="">不限</p>
          <div class="down-arrow"></div>
          <div class="options">
            <ul>
              <li v-for="e in document_types" :key="e.name" :val="e.value" v-text="e.name" @click.stop="choose"></li>
            </ul>
          </div>
        </div>
        <div class="filter" @click="showFilterOptions($event)">
          <p class="name">版本類型</p>
          <p class="value" val="">不限</p>
          <div class="down-arrow"></div>
          <div class="options">
            <ul>
              <li v-for="e in editions" :key="e.name" :val="e.value" v-text="e.name" @click.stop="choose"></li>
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
      <div class="ranking">排序</div>
    </div>
    <div class="search-result">
      <div class="results results-plain" v-if="!relationship_mode">
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
              <router-link v-text="item.id" :to="'/book-detail/' + item.id"></router-link>
            </td>
            <td>
              <router-link v-text="item.content.split('　')[0]" :to="'/book-detail/' + item.id"></router-link>
            </td>
            <td>
              <router-link v-text="item.content" :to="'/book-detail/' + item.id"></router-link>
            </td>
            <td v-text="item.document_type"></td>
            <td v-text="item.language"></td>
            <td v-text="item.institution"></td>
          </tr>
        </table>
        <PageDivider @turnTo="alterPage" :items_sum="items_sum" :each_page_items="each_page_items" />
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
import PageDivider from "@/components/PageDivider.vue";

export default {
  name: "Exploration",
  components: { PageDivider },
  data() {
    return {
      search_result: [],
      relationship_mode: false,
      curr_d: [],
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
          value: "少數民族文字古籍",
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
          value: "其他文字古籍",
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
        { name: "拓本", children: [{ name: "拓東庫本" }, { name: "拓泉州本" }] },
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
        { name: "活字本", children: [{ name: "銅活字本" }, { name: "木活字本" }, { name: "泥活字本" }] },
        { name: "修補本" },
        { name: "集配本" },
        { name: "印刷本" },
        { name: "重修本" },
        { name: "增修本" },
        { name: "補修本" },
        { name: "刺綉本" },
      ],
      dynasties: [
        { name: "不限" },
        { name: "戰國" },
        { name: "秦" },
        { name: "漢" },
        { name: "西漢" },
        { name: "東漢" },
        { name: "三國" },
        { name: "北魏" },
        { name: "東魏" },
        { name: "南朝宋" },
        { name: "南朝梁" },
        { name: "齊" },
        { name: "隋" },
        { name: "唐" },
        { name: "晚唐" },
        { name: "十國後蜀" },
        { name: "五代" },
        { name: "後唐" },
        { name: "十國" },
        { name: "五代宋初" },
        { name: "宋" },
        { name: "宋元明清" },
        { name: "西夏" },
        { name: "西夏或元" },
        { name: "北宋" },
        { name: "南宋" },
        { name: "宋蜀" },
        { name: "大理國" },
        { name: "金" },
        { name: "遼" },
        { name: "元" },
        { name: "元明" },
        { name: "明" },
        { name: "南明" },
        { name: "明末清初" },
        { name: "明末" },
        { name: "清" },
        { name: "太平天國" },
        { name: "民國" },
      ],
    };
  },
  methods: {
    // 开始搜索。根据检索词及筛选条件
    search() {
      let batch = document.querySelector("#batch>.value").getAttribute("val"),
        language = document.querySelector("#language>.value").getAttribute("val"),
        document_type = document.querySelector("#document_type>.value").getAttribute("val");

      axios.get(`/data/text?query=${this.$refs.text.value}&batch=${batch}&language=${language}&document_type=${document_type}`).then((d) => {
        this.search_result = d.data;
        this.items_sum = d.data.length;
        this.curr_d = this.search_result.slice(0, this.each_page_items); // 当前页数据
      });
    },
    alterPage(page_index) {
      this.curr_d = this.search_result.slice(this.each_page_items * (page_index - 1), this.each_page_items * page_index); // 当前页码的文件
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
