<script lang="ts" setup>
import { inject, ref } from "vue";

const list = ref([]);
const current_dynasty = ref(-1);
const show_text = ref("");

const emit = defineEmits(["changeDynastyIDs"]);
const all_edition_dynasty = inject("introductionData").value[1];

function changeEra(e, data, i) {
  current_dynasty.value = i;

  switch (data.name) {
    case "商周":
      show_text.value = "*入選古籍涉及：商";
      break;
    case "秦漢":
      show_text.value = "*入選古籍涉及：秦、西漢、東漢";
      break;
    case "魏晋":
      show_text.value = "*入選古籍涉及：晋（西晋、東晋）、北凉、西凉";
      break;
    case "南北朝":
      show_text.value = "*入選古籍涉及：南北朝（南朝梁、南朝陳、北魏、西魏、北齊）、六朝、高昌";
      break;
    case "隋唐":
      show_text.value = "*入選古籍涉及：隋、唐、武周、吐蕃統治敦煌時期、歸義軍時期";
      break;
    case "五代十國":
      show_text.value = "*入選古籍涉及：五代（後梁、後唐、後周）、吴越";
      break;
    case "宋":
      show_text.value = "*入選古籍涉及：宋（北宋、南宋）、遼、大理國、僞齊、西夏、金";
      break;
    case "元":
      show_text.value = "*入選古籍涉及：蒙古、元";
      break;
    case "明":
      show_text.value = "*入選古籍涉及：明、南明、北元";
      break;
    case "清":
      show_text.value = "*入選古籍涉及：清、太平天國";
      break;
    default:
      show_text.value = "";
  }
  emit("changeDynastyIDs", { ids: data.ids, text: show_text.value });
}

all_edition_dynasty.forEach((el) => {
  if (el.type_p != "其他") {
    if (!list.value.find((e) => e.name == el.type_p)) list.value.push({ name: el.type_p, ids: [el.id] });
    else list.value.find((e) => e.name == el.type_p).ids.push(el.id);
  }
});
</script>

<template>
  <div class="dynasty-selector" ref="dynasty-selector">
    <ul>
      <li
        class="has-data"
        v-for="(e, i) in list"
        :key="e.name"
        @click="changeEra($event, e, i)"
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
      height: fit-content;
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
