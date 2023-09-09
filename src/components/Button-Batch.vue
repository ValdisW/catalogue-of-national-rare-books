<template>
  <div :class="{ 'batch-button': true, activated }" :id="`button-${index}`" @click="clickBatch()" v-text="text"></div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const emit = defineEmits(["addBatch", "deleteBatch"]);
const props = defineProps(["index", "text"]);

const activated = ref(false);

function clickBatch() {
  if (activated.value == false) {
    activated.value = true;
    emit("addBatch", props.index);
  } else {
    activated.value = false;
    emit("deleteBatch", props.index);
  }
}
</script>

<style scoped lang="less">
.batch-button {
  cursor: pointer;
  width: 1.8rem;
  height: 1.8rem;
  line-height: 1.8rem;
  border-radius: 50%;
  border: 1px solid #201d1d;
  text-align: center;
  margin: 0.5rem;
  font-size: 0.8rem;
}
.activated {
  background-color: #201d1d;
  color: #efefef;
}
</style>
