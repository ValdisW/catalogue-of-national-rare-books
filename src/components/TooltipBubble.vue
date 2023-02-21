<template>
  <div v-show="isShowed" class="tooltip-bubble" v-text="props.text"></div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  text: { type: String, required: true },
});
const isShowed = ref(false);

const show = () => {
  isShowed.value = true;
};

const hide = () => {
  isShowed.value = false;
};

defineExpose({
  show,
  hide,
});
</script>

<style lang="less" scoped>
.tooltip-bubble {
  position: absolute;
  z-index: 1000;
  background: #333;
  padding: 0.3rem 0.4rem;
  color: #fff;
  font-size: 0.6rem;
}
</style>
