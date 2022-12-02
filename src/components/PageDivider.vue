<template>
  <div class="page-divider" v-show="pages_sum > 0">
    <!-- 总页码数超过12时 -->
    <div class="all-pages" v-if="pages_sum > 12">
      <li class="prev-page" @click="toPrevPage">上一頁</li>
      <li
        v-for="e in 2"
        :key="e"
        class="page-index"
        :class="{ is_current_page: current_page == e }"
        v-text="e"
        @click="turnTo(e)"
      ></li>
      <div v-if="current_page < 6">
        <li
          v-for="e in 3"
          :key="e"
          v-text="e + 2"
          @click="turnTo(e + 2)"
          :class="{ is_current_page: current_page == e + 2 }"
        ></li>
      </div>
      <span v-if="current_page < pages_sum - 4 && current_page > 5">…</span>
      <div v-if="current_page > 5 && current_page < pages_sum - 4">
        <li
          v-for="e in 5"
          :key="e"
          v-text="current_page + e - 3"
          @click="turnTo(current_page + e - 3)"
          :class="{ is_current_page: current_page == current_page + e - 3 }"
        ></li>
      </div>
      <span>…</span>
      <div v-if="current_page > pages_sum - 5">
        <li
          v-for="e in 3"
          :key="e"
          v-text="e + pages_sum - 5"
          @click="turnTo(e + pages_sum - 5)"
          :class="{ is_current_page: current_page == e + pages_sum - 5 }"
        ></li>
      </div>

      <li
        v-for="e in 2"
        :key="e"
        class="page-index"
        :class="{ is_current_page: current_page == pages_sum + e - 2 }"
        v-text="pages_sum + e - 2"
        @click="turnTo(pages_sum + e - 2)"
      ></li>

      <li class="next-page" @click="toNextPage">下一頁</li>
    </div>

    <!-- 总页码数不超过12时，显示所有页面按钮 -->
    <div class="all-pages" v-else>
      <li
        class="page-index"
        v-for="e in pages_sum"
        :key="e"
        v-text="e"
        @click="turnTo(e)"
        :class="{ is_current_page: e == current_page }"
      ></li>
    </div>

    <!-- 跳转 -->
    <div class="jumper">
      <span>跳轉至第</span>
      <input type="text" name="" id="" v-model.number="current_page" />
      <span>頁</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageDivider",
  computed: {
    pages_sum: function () {
      return this.items_sum ? Math.ceil(this.items_sum / this.each_page_items) : 1; // 暂时这样处理，如果没有任何内容，就有1页而不是0页
    },
  },
  data: function () {
    return {
      current_page: 1,
    };
  },
  watch: {
    current_page(n) {
      if (n > this.pages_sum) this.current_page = this.pages_sum;
      if (n < 1) this.current_page = 1;
      this.$emit("turnTo", n);
    },
    pages_sum(n) {
      if (this.current_page > n) this.current_page = n;
    },
  },
  props: {
    items_sum: Number,
    each_page_items: Number,
  },
  methods: {
    toPrevPage() {
      if (this.current_page > 1) this.current_page--;
    },
    toNextPage() {
      if (this.current_page < this.pages_sum) this.current_page++;
    },
    turnTo(page_index) {
      if (page_index >= 1 && page_index <= this.pages_sum) this.current_page = page_index;
    },
  },
};
</script>

<style lang="less" scoped>
.prev-page,
.next-page {
  display: inline-block;
}
.page-divider {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  .jumper {
    margin: 0 0 0 1rem;
    input {
      width: 1.2rem;
      text-align: center;
    }
  }

  li {
    list-style-type: none;
    text-decoration: none;
    margin: 0.5vmax;
    min-width: 1.5vmax;
    padding: 0.3vmax;
    border-radius: 0.2vmax;
    text-align: center;
    background: #68563a;
    font-size: 1vmax;
    /* position: relative; */
    display: inline-block;
    cursor: pointer;
    color: #eee;
  }
  div {
    display: inline-block;
  }
}
.page-divider li.is_current_page {
  background-color: #fbb03b;
  color: #68563a;
}
.page-divider li:hover {
  filter: brightness(130%);
}
</style>
