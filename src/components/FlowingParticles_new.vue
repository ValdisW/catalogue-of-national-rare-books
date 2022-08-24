<template>
  <div id="flow">
    <svg ref="svg"></svg>
    <button class="play" @click="cancelAnimationFrame">11</button>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "FlowingParticles",
  data() {
    return {
      NUM_PARTICLES: 400,
      PARTICLE_SIZE: 0.5, // View heights
      SPEED: 20000, // 毫秒数
      svg: null,
      particles: [],
      animation_handler: null,
      time: 0,
    };
  },
  methods: {
    test() {
      cancelAnimationFrame(this.animation_handler);
    },
    normalPool(o) {
      let r = 0;
      do {
        let a = Math.round(this.normal({ mean: o.mean, dev: o.dev }));
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
      let r,
        a,
        n,
        e,
        l = o.mean,
        t = o.dev;
      do r = (a = 2 * Math.random() - 1) * a + (n = 2 * Math.random() - 1) * n;
      while (r >= 1);
      return (e = a * Math.sqrt((-2 * Math.log(r)) / r)), t * e + l;
    },

    rand(low, high) {
      return Math.random() * (high - low) + low;
    },

    // 生成粒子
    generateParticleData() {
      const colour = {
        r: 60,
        g: this.randomNormal({ mean: 50, dev: 20 }),
        b: 50,
        a: this.rand(0, 1),
      };
      return {
        x: -2,
        y: -2,
        diameter:
          0.3 +
          Math.max(
            0,
            this.randomNormal({
              mean: this.PARTICLE_SIZE,
              dev: this.PARTICLE_SIZE / 2,
            })
          ),
        duration: this.randomNormal({
          mean: this.SPEED,
          dev: this.SPEED * 0.1,
        }),
        amplitude: this.randomNormal({ mean: 16, dev: 2 }),
        offsetY: this.randomNormal({ mean: 0, dev: 10 }),
        arc: Math.PI * 2,
        startTime: performance.now() - this.rand(0, this.SPEED),
        colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
      };
    },

    // 计算粒子的新位置
    moveParticle(particle) {
      const progress =
        ((this.time - particle.startTime) % particle.duration) /
        particle.duration;

      return {
        ...particle,
        x: progress,
        y:
          Math.sin(progress * particle.arc) * particle.amplitude +
          particle.offsetY,
      };
    },

    draw() {
      const vh = this.svg.attr("height") / 100;

      // 更新粒子位置数据
      this.particles.forEach((particle, index) => {
        this.particles[index] = this.moveParticle(particle);
      });

      // 根据数据更新粒子位置
      d3.selectAll("circle")
        .data(this.particles)
        .attr("fill", (e) => e.colour)
        .attr("cx", (e) => e.x * this.svg.attr("width"))
        .attr("cy", (e) => e.y * vh + this.svg.attr("height") / 2)
        .attr("r", (e) => e.diameter * vh);

      this.animation_handler = requestAnimationFrame(this.draw());
    },

    start() {
      this.svg = d3
        .select(this.$refs.svg)
        .attr("width", 1000)
        .attr("height", 600);
      for (let i = 0; i < this.NUM_PARTICLES; i++)
        this.particles.push(this.generateParticleData());
      this.svg
        .selectAll("circle")
        .data(this.particles)
        .enter()
        .append("circle");

      this.draw();
    },
  },

  mounted() {
    if (document.readystate !== "loading") this.start();
    else
      document.addEventListener("DOMContentLoaded", () => {
        this.start();
      });
  },
};
</script>

<style lang="less" scoped>
#flow {
  position: absolute;
  top: 20vh;
  width: 100vw;
  height: 65vh;
}
</style>
