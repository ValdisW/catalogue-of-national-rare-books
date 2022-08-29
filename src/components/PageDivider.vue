<template>
  <div class="page-divider">
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

    <!-- 縂頁碼數不超过12页时，顯示所有頁面按鈕 -->
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
  </div>
</template>

<script>
export default {
  name: "PageDivider",
  computed: {
    pages_sum: function () {
      return Math.ceil(this.items_sum / this.each_page_items);
    },
  },
  data: function () {
    return {
      current_page: 1,
    };
  },
  props: {
    items_sum: Number,
    each_page_items: Number,
  },
  methods: {
    toPrevPage() {
      this.current_page--;
      this.$emit("turnTo", this.current_page);
    },
    toNextPage() {
      this.current_page++;
      this.$emit("turnTo", this.current_page);
    },
    turnTo(page_index) {
      // this.current_page = parseInt(e.target.innerText);
      this.current_page = page_index;
      this.$emit("turnTo", this.current_page);
    },
  },
};
</script>

<style lang="less" scoped>
.page-divider {
  display: flex;
  justify-content: center;
}
.prev-page,
.next-page {
  display: inline-block;
}
.page-divider {
  user-select: none;
  li {
    list-style-type: none;
    text-decoration: none;
    margin: 0.5vmax;
    min-width: 1.5vmax;
    padding: 0.3vmax;
    border-radius: 0.2vmax;
    text-align: center;
    background: #4a3300;
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
  background-color: rgb(212, 172, 62);
  color: #4a3300;
}
.page-divider li:hover {
  filter: brightness(130%);
}
</style>
