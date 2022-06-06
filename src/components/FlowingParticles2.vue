<template>
    <div id="flow"></div>
</template>

<script>
const d3 = require("d3")
import * as Data from "@/data/dataLoader"
import * as Tooltip from "@/utils/Tooltip"

export default {
    name: "FlowingParticles",
    props: ["rate", 'canvasWidth', 'canvasHeight'],
    data() {
        return {
            NUM_PARTICLES: 600,
            PARTICLE_SIZE: 0.5, // View heights
            SPEED: 20000, // Milliseconds
            particles: [],
        };
    },
    watch: {
        rate: function(newVal, oldVal) {
            this.drawPoints(newVal, oldVal, this.canvasWidth, this.canvasHeight)
        }
    },
    methods: {
        // modified version of random-normal
        normalPool(o) {
            var r = 0;
            do {
                var a = Math.round(this.normal({ mean: o.mean, dev: o.dev }));
                if (a < o.pool.length && a >= 0) return o.pool[a];
                r++;
            } while (r < 100);
        },
        randomNormal(o) {
            if (
                ((o = Object.assign({ mean: 0, dev: 1, pool: [] }, o)),
                Array.isArray(o.pool) && o.pool.length > 0)
            )
                return this.normalPool(o);
            var r,
              a,
              n,
              e,
              l = o.mean,
              t = o.dev;
            do {
                r = (a = 2 * Math.random() - 1) * a + (n = 2 * Math.random() - 1) * n;
            } while (r >= 1);
            return (e = a * Math.sqrt((-2 * Math.log(r)) / r)), t * e + l;
        },
        rand(low, high) {
            return Math.random() * (high - low) + low;
        },
        drawTooltip() {
            let processFunc = function(e, d){
                    return Data.get_book_info(d)
                }
            this.tooltip = Tooltip.Tooltip()
                .extent([
                    [0, 0],
                    [this.svg.attr("width"), this.svg.attr("height")],
                ])
                .tips(
                    ["名录ID", "图录解说"],
                    ["名录ID: ", "图录解说: "],
                    [null],
                    processFunc
                )
                .fontSize(16)
                .padding([8, 4])
                .margin([10, 10]);
            d3.select(this.$el)
                .call(this.tooltip);
            // this.svg.selectAll('circle').each(tooltip.events);
        },
        removeTooltip() {
            d3.select(this.$el).select('.d3Tooltip').remove();
        },
        drawPoints(rate, rate_old, width, height) {
            // this.flow.selectAll('circle')
            //     .attr('cx', -2)
            //     .attr('cy', -2)

            let size=this.flow.selectAll('circle').size()
            
            const vh=this.vh
            let start_id = Math.round(rate*this.NUM_PARTICLES)
            
            let left, right
            if (rate > rate_old) {
                left = Math.round(rate_old*this.NUM_PARTICLES)
                right = start_id+this.PER_NUM
            }
            else {
                left = start_id
                right = Math.round(rate_old*this.NUM_PARTICLES)+this.PER_NUM
            }
            left -= this.PER_NUM
            right += this.PER_NUM
            if (left<0) left=0
            if (right>this.NUM_PARTICLES) right=this.NUM_PARTICLES

            if (size<right) {
                this.flow.selectAll('circle')
                .data(this.book_list.filter((d,i)=>{return i<=right;}))
                .join('circle')
                .filter((d,i)=>{return i>=size})
                .attr("fill", ()=>{
                        let colour = {
                            r: 255,
                            g: this.randomNormal({ mean: 125, dev: 20 }),
                            b: 50,
                            a: this.rand(0, 1),
                        };
                        return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
                    })
                .attr("class", (d,i)=>`point-${i+size}`)
                .style("cursor","pointer")
                .attr('r', ()=>{
                    let r=this.randomNormal({
                        mean: this.PARTICLE_SIZE,
                        dev: this.PARTICLE_SIZE / 2,
                    })
                    return Math.max(0,r)*vh
                })
                .attr('cx', width+10)
                .attr('cy', height/2)
                .each(this.tooltip.events)
            }

            this.flow.selectAll('circle')
                .filter((d,i)=>{return i<=right && i>=left})
                .transition()
                .duration(10000*Math.abs(rate-rate_old))
                .attr('cx', (d,i)=>{
                    const progress = (i+left-start_id)/this.PER_NUM
                    return progress*width
                })
                .attr('cy', (d,i)=>{
                    let attr=this.point_attribute[i]
                    const progress = (i-start_id)/this.PER_NUM
                    let y=Math.sin(progress*attr.arc) * attr.amplitude + attr.offsetY
                    return y*vh+height/2
                })

            // for (let i=0;i<this.NUM_PARTICLES;i++) {
            //     let id=i
            //     let point=d3.select(`circle.point-${id}`)._groups[0][0]
            //     let attr=this.point_attribute[i]
            //     const progress = (i-start_id)/this.PER_NUM
            //     let y=Math.sin(progress*attr.arc) * attr.amplitude + attr.offsetY
            //     d3.select(point)
            //         .transition()
            //         .duration(1000)
            //         .attr('cx', progress*width)
            //         .attr('cy', y*vh+height/2)
            //     // if (id<start_id) {
            //     //     d3.select(point)
            //     //     .transition()
            //     //     .duration(1000)
            //     //     .attr('cx', -2)
                    
            //     // }
            //     // else if(id<start_id+this.PER_NUM) {
            //     //     let attr=this.point_attribute[i]
            //     //     const progress = (i-start_id)/this.PER_NUM
            //     //     let y=Math.sin(progress*attr.arc) * attr.amplitude + attr.offsetY
            //     //     d3.select(point)
            //     //         .transition()
            //     //         .duration(1000)
            //     //         .attr('cx', progress*width)
            //     //         .attr('cy', y*vh+height/2)
            //     // }
            //     // else {
            //     //     d3.select(point)
            //     //     .transition()
            //     //     .duration(1000)
            //     //     .attr('cx', width+(10))
            //     // }
            // }
        },
        initializePointAttribute() {
            this.point_attribute = []
            for (let i=0;i<this.NUM_PARTICLES;i++) {
                let offsetY=this.randomNormal({ mean: 0, dev: 10 })
                let amplitude=this.randomNormal({ mean: 16, dev: 2 })
                let arc=Math.PI * 2
                this.point_attribute.push({
                    offsetY: offsetY,
                    amplitude: amplitude,
                    arc: arc
                })
            }
        },
        initializeFlow(width, height) {
            let self = this
            self.vh=height/100;
            
            // self.initializeHoverFunction()

            self.book_list = Object.keys(Data.get_data().book_info)
            self.NUM_PARTICLES = this.book_list.length
            self.PER_NUM = Math.round(this.NUM_PARTICLES/10)
            
            self.initializePointAttribute()

            d3.select(self.$el).selectAll("svg").remove()
            self.svg = d3.select(self.$el)
                .append("svg")
                .attr("width", width)
                .attr("height", height)  
            
            self.flow = self.svg.append("g")
                .attr("id", "points")
 
            self.removeTooltip()

            // self.points = self.flow.selectAll('circle')
            //     .data(self.book_list)
            //     .join('circle')
            //     .attr("fill", ()=>{
            //             let colour = {
            //                 r: 255,
            //                 g: this.randomNormal({ mean: 125, dev: 20 }),
            //                 b: 50,
            //                 a: this.rand(0, 1),
            //             };
            //             return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`
            //         })
            //     .attr("class", (d,i)=>`point-${i}`)
            //     .style("cursor","pointer")
            //     .attr('r', ()=>{
            //         let r=this.randomNormal({
            //             mean: this.PARTICLE_SIZE,
            //             dev: this.PARTICLE_SIZE / 2,
            //         })
            //         return Math.max(0,r)*self.vh
            //     })
            //     .attr('cx', width+10)
            //     .attr('cy', height/2)

            self.drawTooltip()
        }
    },
    mounted() {
        this.initializeFlow(this.canvasWidth, this.canvasHeight)
    },
};
</script>

<style lang="less" scoped>
#flow {
  width: 100vw;
  height: 100vh;
}
</style>
