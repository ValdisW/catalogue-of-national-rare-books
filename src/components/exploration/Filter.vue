<script lang="ts" setup>
import { computed } from "vue";
import { Filter } from "#/axios";

const emit = defineEmits(["filter"]);

const props = defineProps({
  attr_id: String,
  attr_name: String, // 筛选器的标题
  attrs: Array<Filter>, // 筛选器展示的内容。键值对，各个属性id及其值 e.g. {name: "多文種", ids: ["1", "16", "23"], value: 345，selected: false}
  db_column: String,
});

const max_value = computed(() => {
  let max = 0;
  props.attrs!.forEach((e) => {
    if (max < e.value) max = e.value;
  });
  return max;
});

/**
 * 点击某个筛选项后，更新筛选条件
 * @param {*} e 被点击的筛选条件的对应数据。内容格式与attrs对应
 */
function updateSelect(e: Filter) {
  e.selected = !e.selected;
  let selected_ids: string[] = [];

  // 获取筛选出来的古籍的id
  for (let e of props.attrs!.filter((el) => el.selected).map((el) => el.ids)) {
    selected_ids = selected_ids.concat(e);
  }
  emit("filter", {
    attr: props.attr_id,
    value: selected_ids,
  });
}
</script>

<template>
  <div class="filter">
    <p class="title" v-text="attr_name"></p>
    <div class="content">
      <ul>
        <li v-for="e in attrs" :class="{ selected: e.selected }" :key="e" :val="e.value" @click="updateSelect(e)">
          <!-- 条形-->
          <div
            class="bar"
            :style="{
              width: (Math.log(e.value + 1) / Math.log(max_value + 1)) * 100 + '%',
            }"
          ></div>

          <!-- 各属性值及其对应的数量 -->
          <div class="info">
            <span v-text="e.name"></span>
            <span v-text="e.value"></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
.filter {
  user-select: none;
  position: relative;
  .title {
    position: absolute;
    font-size: 0.7rem;
    width: 1rem;
    left: -1.2rem;
    top: 50%;
    transform: translateY(-50%);
  }
  .content {
    width: 7rem;
    height: 16.5vh;
    overflow-y: scroll;
    overflow-x: hidden;
    background: rgb(153, 135, 105);
    margin: 0 0 2vh;
    ul {
      list-style: none;
      li {
        color: #efefef;
        position: relative;
        margin: 0.1rem 0;
        font-size: 0.6rem;
        cursor: pointer;
        position: relative;
        &:hover {
          filter: brightness(80%);
          background: rgb(153, 135, 105);
        }
        .bar {
          background: rgb(88, 71, 44);
          height: 1rem;
        }
        .info {
          display: flex;
          justify-content: space-between;
          width: 100%;
          position: absolute;
          top: 0;
        }
      }
      li.selected {
        background: #e1b74b;
        .bar {
          background: #c78320;
        }
      }
    }
  }
}
</style>
