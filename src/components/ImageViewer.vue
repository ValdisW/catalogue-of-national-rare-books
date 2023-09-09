<template>
  <div class="image-viewer" v-show="show">
    <div class="button">
      <!-- <div class="scale-to-origin" @click="scaleToOrigin">還原</div> -->
    </div>
    <div class="close" @click="close">
      <div></div>
      <div></div>
    </div>

    <div class="img-wrapper">
      <img ref="ImageRef" class="image" :src="imageUrl" :alt="imageText" v-drag @mousewheel.prevent="scaleFun" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps({ imageUrl: String, imageText: String });

const imgScale = ref(1);
const show = ref(false);

const ImageRef = ref<HTMLImageElement>(null);

function scaleFun(e: WheelEvent) {
  let direction = e.deltaY > 0 ? -0.1 : 0.1;
  let left = ImageRef.value.offsetLeft;
  let top = ImageRef.value.offsetTop;

  imgScale.value = Math.max(imgScale.value + direction, 0.1);
  ImageRef.value.style.transform = `translate(-50%,-50%) scale(${imgScale.value})`;
  ImageRef.value.style.left = left + "px";
  ImageRef.value.style.top = top + "px";
}

// function scaleToOrigin() {
//   imgScale.value = 1;
//   ImageRef.value.style = "width:auto;height:auto;max-height:100%;max-width:100%;";
// }

function open() {
  show.value = true;
}

function close() {
  show.value = false;
  // scaleToOrigin();
}

let directives = {
  drag: function (dragItem, _, vnode) {
    vnode.el.parentElement.parentElement.onmousedown = (e) => {
      e.preventDefault();
      let disX = e.pageX - dragItem.offsetLeft;
      let disY = e.pageY - dragItem.offsetTop;
      document.onmousemove = (e) => {
        e.preventDefault();
        let left = e.pageX - disX;
        let top = e.pageY - disY;
        // console.log('move', e.pageX, e.pageY, left, top)
        dragItem.style.left = left + "px";
        dragItem.style.top = top + "px";
      };
      document.onmouseup = (e) => {
        e.preventDefault();
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
};

defineExpose({ open, close });
</script>

<style scoped lang="less">
.image-viewer {
  overflow: hidden;
  background: #000000a7;
  width: 100vw;
  height: 100vh;

  position: absolute;
  z-index: 200;

  .img-wrapper {
    width: 100vw;
    // height: 100vh;
    bottom: 5vh;
    top: 5vh;
    position: absolute;
    // text-align: center;
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      // object-fit: cover;
      margin: 0 auto;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    z-index: 1;
  }
  .close {
    position: absolute;
    right: 3rem;
    top: 3rem;
    z-index: 2;
    width: 2rem;
    height: 2rem;
    color: #efefef;
    cursor: pointer;
    div {
      width: 100%;
      height: 0.1rem;
      background-color: #efefef;
      border-radius: 0.05rem;
    }
    div:nth-child(1) {
      transform: translateY(1.5vmax) rotate(45deg);
    }
    div:nth-child(2) {
      transform: translateY(1.5vmax) rotate(135deg);
      margin-top: -2px;
    }
  }
  .button {
    width: 10vw;
    position: absolute;
    z-index: 3;
  }
}
</style>
