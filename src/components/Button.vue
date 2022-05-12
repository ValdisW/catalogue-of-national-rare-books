<template>
<div class="container">
  <!-- <button v-on:click="changeView">Change View</button> -->
  <ul>
    <li class="show" id="click-unit"><span v-on:click="changeView('unit')" style="cursor: pointer;">点阵</span></li>
    <!-- <li class="placeholder"></li> -->
    <li class="hidden" id="click-map"><span v-on:click="changeView('map')" style="cursor: pointer;">地图</span></li>
  </ul>
</div>
</template>

<script>
// const d3 = require("d3")
export default {
    name: "Button",
    // props: ['canvasWidth', 'canvasHeight'],
    data() {
        return {
        }
    },
    computed: {
        
    },
    watch: {
        // view(newVal) {
        //     d3.select(this.$el).select(".show").attr("class", "hidden");
        //     d3.select(this.$el).select("#click-"+newVal).attr("class", "show");
        // }
    },
    methods: {
        changeView(view) {
            // console.log(this.view, view)
            // if (this.view == view) {
            //     return;
            // }
            // this.view = view
            this.$emit("changeView", view);
        }
    },
    mounted() {
    }
}
</script>

<style scoped lang="less">

</style>