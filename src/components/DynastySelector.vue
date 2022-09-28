<template>
  <div class="dynasty-selector">
    <ul>
      <li v-for="e in list" :key="e.name">
        <span class="icon"></span>
        <span v-text="e.name" @click="changeEra(e.ids)"></span>
      </li>
      <li class="no-data">
        <span class="icon"></span>
        <span>一九四九年後</span>
      </li>
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
        if (!this.list.find((e) => e.name == el.type_p)) this.list.push({ name: el.type_p, ids: [el.id] });
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
      list-style: none;
      margin: 0 0.5rem;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      span:first-child {
        cursor: pointer;
        background: #5b898a;
        transform: rotate(45deg);
        margin: 0 0 0.3rem;
        width: 0.7rem;
        height: 0.7rem;
      }
      span:last-child {
        font-size: 0.7rem;
        width: 0.8rem;
        text-align: center;
      }
    }
    li.no-data {
      span:first-child {
        cursor: pointer;
        background: #929292;
        transform: rotate(45deg);
        width: 0.7rem;
        height: 0.7rem;
      }
    }
  }
}
</style>
