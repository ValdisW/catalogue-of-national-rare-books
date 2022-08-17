<template>
  <div class="image-viewer">
    <div class="button">
      <div class="scale-to-width" @click="scaleToWidth">适应宽度</div>
      <div class="scale-to-height" @click="scaleToHeight">适应高度</div>
      <div class="scale-to-origin" @click="scaleToOrigin">原始尺寸</div>
    </div>
    <div class="close" @click="close">关闭</div>

    <div class="img-wrapper">
      <img
        class="image"
        src="@/assets/placeholder.jpg"
        :alt="imageText"
        v-drag
        @mousewheel.prevent="scaleFun"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageViewer",
  props: ["imageUrl", "imageText"],
  data() {
    return {
      imgScale: 1,
    };
  },
  computed: {
    // scaleImg: function () {
    //   if (this.img == undefined)
    //     return `transform:translate(-50%,-50%) scale(${this.imgScale})`
    //   let translate = this.img.style.transform.split(' ')
    //   translate = translate[0]+translate[1]
    //   console.log('trans', translate)
    //   console.log('left', this.img.style)
    //   return `transform:${translate} scale(${this.imgScale})`
    // }
  },
  watch: {},
  methods: {
    scaleFun(e) {
      let direction = e.deltaY > 0 ? -0.1 : 0.1;
      let left = this.img.offsetLeft;
      let top = this.img.offsetTop;

      this.imgScale = Math.max(this.imgScale + direction, 0.1);
      this.img.style.transform = `translate(-50%,-50%) scale(${this.imgScale})`;
      this.img.style.left = left + "px";
      this.img.style.top = top + "px";
    },
    scaleToWidth() {
      this.imgScale = 1;
      this.img.style = "width:100%;height:auto;";
    },
    scaleToHeight() {
      this.imgScale = 1;
      this.img.style = "height:100%;width:auto;";
    },
    scaleToOrigin() {
      this.imgScale = 1;
      this.img.style = "width:auto;height:auto;max-height:100%;max-width:100%;";
    },
    close() {
      this.$emit("remove");
    },
  },
  directives: {
    drag: function (dragItem) {
      document.onmousedown = (e) => {
        e.preventDefault();
        let disX = e.pageX - dragItem.offsetLeft;
        let disY = e.pageY - dragItem.offsetTop;
        // console.log('down', e.pageX, e.pageY, dragItem.offsetLeft, dragItem.offsetTop)
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
  },
  created() {},
  mounted() {
    this.img = document.getElementsByClassName("image")[0];
    console.log(this.img.offsetHeight);
  },
};
</script>

<style scoped lang="less">
.image-viewer {
  background: #000000a7;
  width: 100vw;
  height: 100vh;
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
    width: 10vw;
    position: absolute;
    z-index: 2;
    top: 10vh;
  }
  .button {
    width: 10vw;
    position: absolute;
    z-index: 3;
  }
}
</style>
