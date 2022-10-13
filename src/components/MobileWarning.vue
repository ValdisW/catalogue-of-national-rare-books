<template>
  <div class="mobile-warning">
    <p>
      非常抱歉，本站點暫不支持移動端訪問。<br />請在PC端使用Chrome
      20+/Edge/Safari 6+/FireFox 19+訪問本站。
    </p>
  </div>
</template>

<style lang="less" scoped>
.mobile-warning {
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  background: #333;
  position: absolute;
  top: 0;
  left: 0;
  p {
    color: #efefef;
    text-align: center;
    margin-top: 50vh;
  }
}
</style>
