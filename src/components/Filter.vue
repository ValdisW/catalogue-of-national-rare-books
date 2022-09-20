<template>
  <div class="filter">
    <p class="title" v-text="attr_name"></p>
    <div class="content">
      <ul>
        <li
          v-for="e in attrs"
          :class="{ selected: e.selected }"
          :key="e"
          :val="e.value"
          @click="toggleSelect(e)"
        >
          <!-- 条形-->
          <div
            class="bar"
            :style="{
              width:
                (Math.log(e.value + 1) / Math.log(max_value + 1)) * 100 + '%',
            }"
          ></div>

          <!-- 各属性值及其对应的数量 -->
          <div class="info">
            <span
              v-text="
                $store.state['all_' + attr_id].find((el) => el.id == e.name)
                  ? $store.state['all_' + attr_id].find((el) => el.id == e.name)
                      .name
                  : '未知'
              "
            ></span>
            <span v-text="e.value"></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Filter",
  props: {
    attr_id: String,
    attr_name: String, // 筛选器的标题
    attrs: Array, // 筛选器展示的内容。键值对，各个属性id及其值 e.g. {name: 12, value: 345，selected: false}
  },
  computed: {
    max_value() {
      let max = 0;
      this.attrs.forEach((e) => {
        if (max < e.value) max = e.value;
      });
      return max;
    },
  },
  methods: {
    // 点击某个筛选项
    toggleSelect(e) {
      e.selected = !e.selected;
      this.$emit("filter", {
        attr: this.attr_id,
        value: this.attrs
          .filter((el) => el.selected)
          .map((el) => (el = el.name)),
      });
    },
  },
};
</script>

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
    height: 6rem;
    overflow-y: scroll;
    overflow-x: hidden;
    background: rgb(153, 135, 105);
    margin: 1rem 0;
    ul {
      list-style: none;
      li {
        color: #fff;
        position: relative;
        margin: 0.1rem 0;
        font-size: 0.6rem;
        cursor: pointer;
        position: relative;
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
        background: rgb(70, 83, 85);
      }
      li:hover {
        filter: brightness(80%);
        background: rgb(153, 135, 105);
      }
    }
  }
}
</style>
