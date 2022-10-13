<template>
  <div class="dynasty-selector">
    <ul>
      <li
        class="has-data"
        v-for="(e, i) in list"
        :key="e.name"
        @click="changeEra(e.ids, i)"
        :class="{ active: i == current_dynasty }"
      >
        <span class="icon"></span>
        <span v-text="e.name"></span>
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
      current_dynasty: -1,
    };
  },
  methods: {
    changeEra(ids, i) {
      this.current_dynasty = i;
      this.$emit("changeDynastyIDs", ids);
    },
  },
  created() {
    this.$store.state.all_edition_dynasty.forEach((el) => {
      if (el.type_p != "其他") {
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
  top: 1.5rem;
  left: 0.5rem;

  ul {
    display: flex;
    li {
      list-style: none;
      padding: 0.5rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      span:first-child {
        border: 0.05rem solid #9f7777;
        transform: rotate(45deg);
        margin: 0 0 0.3rem;
        width: 0.7rem;
        height: 0.7rem;
        transition: 0.3s;
      }
      span:last-child {
        font-size: 0.7rem;
        width: 0.8rem;
        text-align: center;
      }
    }
    li.active {
      span:first-child {
        background: #9f7777;
      }
    }
    li.no-data {
      cursor: default;
      span:first-child {
        border: 0.04rem solid #0006;
      }
      span:last-child {
        color: #0006;
      }
    }
    li.has-data:hover {
      span:first-child {
        background: #9f7777;
      }
    }
  }
}
</style>
