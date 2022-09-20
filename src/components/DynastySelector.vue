<template>
  <div class="dynasty-selector">
    <ul>
      <li
        v-for="e in list"
        :key="e.name"
        v-text="e.name"
        @click="changeEra(e.ids)"
      ></li>
      <li class="no-data">一九四九年後</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DynastySelector",
  data() {
    return {
      list: [],
    };
  },
  methods: {
    changeEra(ids) {
      this.$emit("changeDynastyIDs", ids);
    },
  },
  created() {
    this.$store.state.all_edition_dynasty.forEach((el) => {
      if (el.type_p != "未知") {
        if (!this.list.find((e) => e.name == el.type_p))
          this.list.push({ name: el.type_p, ids: [el.id] });
        else this.list.find((e) => e.name == el.type_p).ids.push(el.id);
      }
    });
  },
};
</script>

<style lang="less" scoped>
.dynasty-selector {
  z-index: 5;
  user-select: none;
  position: absolute;
  top: 4rem;
  left: 0;

  ul {
    display: flex;
    li {
      font-size: 0.7rem;
      background: #fff1dd;
      list-style: none;
      width: 0.7rem;
      margin: 0 1rem;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      border-radius: 0.3rem;
      cursor: pointer;
    }
    li.no-data {
      background: #e6e6e6;
    }
  }
}
</style>
