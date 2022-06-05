<template>
    <div class="container">
    </div>
</template>

<script>
const d3 = require("d3")
export default {
    name: "ScrollBar",
    props: ['canvasWidth', 'canvasHeight'],
    data() {
        return {
            rate: null,
        }
    },
    computed: {
        
    },
    watch: {
        rate(newVal) {
            this.$emit("changeRate", newVal);
        }
    },
    methods: {
        initializeScrollBar(width, height) {
            let self = this

            let bar_height = height/1.5
            let bar_width = width/10.0
            
            d3.select(self.$el).selectAll("svg").remove()
            self.svg = d3.select(self.$el)
                .append("svg")
                .attr("width", width)
                .attr("height", height)  

            
            self.scroll_line = self.svg.append("g")
                .attr("id", "scroll-line")
                .attr("transform", `translate(0, ${height/2})`)
                .append('line')
                .attr('x1', 0)
                .attr('x2', width)
                .attr('y1', 0)
                .attr('y2', 0)
                .style("stroke", "#fa9668")

            self.bar = self.svg.append('g')
                .attr('transform', `translate(0,${(height-bar_height)/2})`)
                .append('rect')
                .attr('width', bar_width)
                .attr('height', bar_height)
                .attr('fill', 'rgba(0, 0, 0, 0.3)')
                .attr('transform', 'translate(0, 0)')

            self.rate = 0
            // self.isMouseDown = false
            // self.svg.on("mousedown", (e)=>{
            //     self.isMouseDown = true
            //     let x=e.offsetX-bar_width/2
            //     if (x<0) x=0
            //     if (x+bar_width>=width) x=width-bar_width
            //     self.bar.attr('transform', `translate(${x}, 0)`)
            //     self.rate = x/width
            // })
            // self.svg.on("mousemove", (e)=>{
            //     if (self.isMouseDown) {
            //         let x=e.offsetX-bar_width/2
            //         if (x<0) x=0
            //         if (x+bar_width>=width) x=width-bar_width
            //         self.bar.attr('transform', `translate(${x}, 0)`)
            //         self.rate = x/width
            //     }
            // })
            // self.svg.on('mouseup', function() {
            //     self.isMouseDown = false       
            // })

            let box_drag = d3.drag()
                .on('drag', (e)=>{
                    let x=e.x-bar_width/2
                    if (x<0) x=0
                    if (x+bar_width>=width) x=width-bar_width
                    self.bar.attr('transform', `translate(${x}, 0)`)
                    self.rate = x/width
                })
            self.bar.call(box_drag) 
        }
    },
    mounted() {
        this.initializeScrollBar(this.canvasWidth, this.canvasHeight)
    }
}
</script>

<style scoped lang="less">

</style>