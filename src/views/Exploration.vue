<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { loadExplorationData, searchForBooks, serachAll } from "@/api";
import { useStore } from "@/store";

import SearchBar from "@/components/exploration/SearchBar.vue";
import PageDivider from "@/components/exploration/PageDivider.vue";
import Filter from "@/components/exploration/Filter.vue";
import { Book } from "#/axios";

const emit = defineEmits(["startLoading", "endLoading", "openBookDetail"]);

const PageDividerRef = ref<InstanceType<typeof PageDivider> | null>(null);

const complete = ref(false);
const show_results = ref(false);
const search_result = ref<Book[]>([]); // 所有检索结果
const filtered_result = ref<Book[]>([]); // 筛选后的结果
const curr_d = ref<Book[]>([]); // 当前页的检索结果
const each_page_items = ref(50); // 每页的检索结果数量
const wait = ref(false); // 点击搜索按钮的等待，防止重复点击
const curr_filter = ref({}); // 当前的筛选条件
const has_filtered = ref(false); // 标记是否已经进行过筛选（用于正确显示检索结果数量以及页码数）
const store = useStore();

// 筛选器数据
const filter_data: {
  id: string | number;
  name: string; // 显示在筛选器左侧的名称
  db_column: string;
  value: { name: string; value: number; selected: boolean }[];
}[] = reactive([
  { id: "document_type", name: "文獻類型", db_column: "name", value: [] },
  { id: "language", name: "文種", db_column: "type", value: [] },
  {
    id: "edition_dynasty",
    name: "版本朝代",
    db_column: "name",
    value: [],
  },
  {
    id: "edition_type",
    name: "版本類型",
    db_column: "level_1",
    value: [],
  },
]);

// 展示字段与检索字段
const search_attrs = [
  { name: "名録批次", value: "batch" },
  { name: "名録號", value: "id" },
  { name: "題名", value: "name" },
  { name: "版本", value: "edition" },
  { name: "版本朝代", value: "edition_dynasty" },
  { name: "文獻類型", value: "document_type" },
  { name: "文種", value: "language" },
  { name: "收藏省份", value: "province" },
  { name: "收藏單位", value: "institution" },
  { name: "責任行爲", value: "action" },
  { name: "責任者名稱", value: "person_name" },
  { name: "責任者朝代", value: "person_dynasty" },
  { name: "責任者身份", value: "person_status" },
];

const display_attrs = reactive([
  { name: "名録批次", value: "batch", order: true, byID: false },
  { name: "名録號", value: "id", order: true, byID: false },
  { name: "題名", value: "name", order: false, byID: false },
  { name: "版本", value: "edition", order: false, byID: false },
  { name: "版本朝代", value: "edition_dynasty", order: false, byID: true },
  { name: "文獻類型", value: "document_type", order: false, byID: true },
  { name: "文種", value: "language", order: false, byID: true },
  { name: "收藏省份", value: "province", order: false, byID: true },
  { name: "收藏單位", value: "institution", order: false, byID: true },
]);

/**
 * 多个指定字段的检索
 * @param {*} values 检索词及筛选条件
 */
function search(values: Array<{ value: string; attr: string }>) {
  if (!wait.value) {
    wait.value = true;
    searchForBooks(values)
      .then((res) => {
        search_result.value = res.data;
        curr_d.value = search_result.value.slice(0, each_page_items.value); // 当前页数据
        convertResult();
        updateFilter();
        show_results.value = true;
        wait.value = false;
      })
      .then((err) => {
        if (err) console.error(err);
      });
    has_filtered.value = false;
  }
}

/**
 * 全字段检索
 * @param {*} query 输入框中的内容
 */
function allAttrSearch(query: string) {
  if (!wait.value) {
    wait.value = true;
    serachAll(query)
      .then((res) => {
        search_result.value = res.data;
        curr_d.value = search_result.value.slice(0, each_page_items.value); // 当前页数据
        convertResult();
        updateFilter();
        show_results.value = true;
        wait.value = false;
      })
      .then((err) => {
        if (err) console.error(err);
      });
    has_filtered.value = false;
  }
}

// 更新统计数据
function updateFilter() {
  for (let i in filter_data) {
    filter_data[i].value = getSum(search_result.value, filter_data[i].id + "_id");

    // 根据大类，作进一步统计
    let temp: { id: string | number; value: number; type: string }[] = [];
    for (let e of filter_data[i].value) {
      temp.push({
        id: e.name,
        value: e.value,
        type: store["all_" + filter_data[i].id].find((el) => el.id == e.name)[filter_data[i].db_column],
      });
    }

    let result: {
      name: string;
      ids: string[];
      value: string;
      selected: boolean;
    }[] = [];
    for (let i in temp) {
      if (!result.find((el) => el.name == temp[i].type))
        result.push({
          name: temp[i].type,
          ids: [temp[i].id],
          value: temp[i].value,
          selected: false,
        });
      else {
        result.find((el) => el.name == temp[i].type).ids.push(temp[i].id);
        result.find((el) => el.name == temp[i].type).value += temp[i].value;
      }
    }
    filter_data[i].value = result;
  }
}

function convertResult() {
  curr_d.value.forEach((e) => {
    ["edition_dynasty", "document_type", "language", "province", "institution"].map((attr) => {
      e[attr] = store[`all_${attr}`].find((ele) => ele.id == e[`${attr}_id`]) ? store[`all_${attr}`].find((ele) => ele.id == e[`${attr}_id`]).name : "-";
    });
  });
}

// Filter发生变化
function filterResult(e) {
  curr_filter.value[e.attr] = e.value;
  filtered_result.value = search_result.value.filter((el) => {
    let flag = true;
    for (let i in curr_filter.value) {
      if (!curr_filter.value[i].length) continue;
      let _flag = false;
      for (let v of curr_filter.value[i]) _flag = _flag || "" + el[i + "_id"] == v;
      flag = flag && _flag;
    }
    return flag;
  });

  curr_d.value = filtered_result.value.slice(0, each_page_items.value); // 当前页数据
  convertResult();

  has_filtered.value = true;
  PageDividerRef.value?.turnTo(1);
}

/**
 * 根据检索结果与属性名，统计不同属性值对应的检索结果条数
 * @param {array} r 检索结果
 * @param {string} attr 属性名，应该是r中的某个键名
 * @returns 返回{属性名（id）, 属性值（数量）, 选中状态（给筛选器用）}
 */
function getSum(results: Book[], attr: string): { name: string; value: number; selected: boolean }[] {
  let a = {};
  results.forEach((e) => {
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
}

// 检索结果按指定字段正序/倒序排序
function toggleRank(attr: string, order: boolean) {
  // 更新检索结果
  if (order) {
    search_result.value.sort((a, b) => {
      let flag;
      if (typeof a[attr] === "string") flag = b[attr].localeCompare(a[attr]);
      else if (typeof a[attr] === "number") flag = b[attr] - a[attr];
      else flag = 1;
      return flag;
    });
  } else {
    search_result.value.sort((a, b) => {
      let flag;
      if (typeof a[attr] === "string") flag = a[attr].localeCompare(b[attr]);
      else if (typeof a[attr] === "number") flag = a[attr] - b[attr];
      else flag = 1;
      return flag;
    });
  }

  // 修改排序标记
  let t = display_attrs.find((e) => e.value == attr).order;
  display_attrs.forEach((el) => {
    el.order = false;
  });
  display_attrs.find((e) => e.value === attr).order = !t;

  curr_d.value = search_result.value.slice(0, each_page_items.value);
  convertResult();

  PageDividerRef.value?.turnTo(1); // 返回第一页
}

function alterPage(page_index: number) {
  if (has_filtered.value) curr_d.value = filtered_result.value.slice(each_page_items.value * (page_index - 1), each_page_items.value * page_index);
  else curr_d.value = search_result.value.slice(each_page_items.value * (page_index - 1), each_page_items.value * page_index);
  convertResult();
}

onMounted(() => {
  loadExplorationData().then((res) => {
    store.loadExplorationData(res.data);

    complete.value = true;
    emit("endLoading");

    filtered_result.value = search_result.value = store.books;

    curr_d.value = search_result.value.slice(0, each_page_items.value); // 当前页数据
    convertResult();

    updateFilter();
  });
});

onUnmounted(() => {
  emit("startLoading");
});
</script>

<template>
  <div class="exploration" :class="{ new: !show_results }" v-if="complete">
    <div class="container">
      <div class="search" :class="{ new: !show_results }">
        <SearchBar :wait="wait" :attr_list="search_attrs" @search="search" @allAttrSearch="allAttrSearch" />
      </div>

      <div class="main-content" v-show="show_results">
        <!-- 左側篩選欄 -->
        <div class="filters">
          <Filter v-for="e in filter_data" :key="e.id" :attr_name="e.name" :attr_id="e.id" :attrs="e.value" :db_column="e.db_column" @filter="filterResult" />
        </div>

        <!-- 右側檢索結果 -->
        <div class="search-result">
          <p class="total">
            共計
            {{ has_filtered ? filtered_result.length : search_result.length }}
            條結果
          </p>
          <div class="results results-plain">
            <table class="results-list">
              <thead>
                <tr>
                  <th v-for="e in display_attrs" :key="e.name" @click="toggleRank(e.value, e.order)">
                    <span class="attr-title" v-text="e.name"></span>
                    <span class="rank">
                      <span :class="{ active: e.order == false }"></span>
                      <span :class="{ active: e.order }"></span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in curr_d" :key="item.id" class="item-block" @click="emit('openBookDetail', item.id)">
                  <td v-text="'第' + item.batch + '批'"></td>
                  <td v-text="item.id || '-'"></td>
                  <td v-text="item.name || '-'"></td>
                  <td v-text="item.edition || '-'"></td>
                  <td v-text="item.edition_dynasty"></td>
                  <td v-text="item.document_type"></td>
                  <td v-text="item.language"></td>
                  <td v-text="item.province"></td>
                  <td v-text="item.institution"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <PageDivider @turnTo="alterPage" :items_sum="has_filtered ? filtered_result.length : search_result.length" :each_page_items="each_page_items" ref="PageDividerRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.exploration {
  .container {
    font-size: 0.8rem;
    width: 100vw;
    height: 100vh;
    padding: 3rem 5rem;
    box-sizing: border-box;
    background: #f1e8dbcc;
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
        margin: 0.3rem 0.7rem 0 0;
        height: 70vh;
        flex-direction: column;
        justify-content: space-between;
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
                  span.active {
                    border: 0.23rem solid #68563a;
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
              &:hover {
                background: #29150733;
              }
              td {
                text-align: center;
                padding: 4px 8px;
                a {
                  text-decoration: none;
                  color: #4a0400;
                  &:hover {
                    text-decoration: underline;
                  }
                }
              }
              td:nth-of-type(3) {
                font-size: 0.8rem;
              }
            }
            .item-block:nth-child(2n + 1) {
              background: #42210b12;
            }
          }
        }
      }
    }
  }
  // background: linear-gradient(#b8a885, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #b8a885);
}
.exploration.new {
  background: url(../assets/search-bg.jpg) no-repeat center;
  background-size: cover;
}
</style>
