<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  attr_list: Array,
});

const show_list = ref(false);
const default_text = ref(props.attr_list[0].name);
const curr_value = ref(props.attr_list[0].value);

function toggleShowList() {
  show_list.value = !show_list.value;
}

function select(e: MouseEvent) {
  curr_value.value = e.target.getAttribute("name");
  toggleShowList();
  default_text.value = e.target.innerText;
}

defineExpose({
  curr_value,
});
</script>

<template>
  <!-- 检索时用到的下拉列表，用来指定具体的检索字段 -->
  <div class="droplist">
    <div class="box" @click="toggleShowList">
      <span ref="box-text" class="selected" v-text="default_text"></span>
      <span></span>
    </div>
    <ul class="list" v-show="show_list">
      <li
        v-for="attr in attr_list"
        :key="attr"
        @click="select"
        v-text="attr.name"
        :name="attr.value"
      ></li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
@offset: 0.5rem;
.droplist {
  font-size: 0.7rem;
  display: inline-block;
  width: calc(4rem + 12px);
  height: 2.1rem;
  user-select: none;
  margin: 0 @offset 0 calc(-4rem - @offset - 12px);
  vertical-align: top; // 防错位

  .box {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: right;
    cursor: pointer;
    span:nth-child(2) {
      display: inline-block;
      width: 0;
      height: 0;
      border: 0.3rem solid #201d1d;
      border-bottom-width: 0;
      border-left-color: transparent;
      border-right-color: transparent;
      margin: 0.2rem 0 0 0.2rem;
    }
  }
  .list {
    position: absolute;
    list-style: none;
    background-color: #333;
    color: #efefef;
    border-radius: 0.3rem;
    text-align: center;
    z-index: 200;
    width: calc(4rem + 12px);
    overflow: hidden;
    max-height: 10rem;
    overflow-y: scroll;
    margin: 0 0 0 @offset;
    li {
      cursor: pointer;
      height: 1.5rem;
      line-height: 1.5rem;
    }
  }
  .list > li:hover {
    background: #333;
    color: #efefef;
    filter: brightness(160%);
  }
}
</style>
