<template>
  <div id="flow">
    <div class="content">
      <div class="section-name">
        <span></span>
        <span>入選名録古籍版本朝代分布</span>
        <span></span>
        <span></span>
      </div>
      <div class="main">
        <!-- 年代选择组件 -->
        <DynastySelector @changeDynastyIDs="changeDynasty" />

        <!-- 暂停/继续 -->
        <div class="togglePause" :class="{ continue: !playing }" @click="togglePause"></div>

        <!-- 画布 -->
        <svg id="particles-svg" ref="particles-svg" @click="togglePause"></svg>

        <!-- 右下角文字 -->
        <div class="comment" v-text="curr_comment"></div>

        <!-- 悬浮窗 -->
        <BookDetailTooltip
          @openBookDetail="$emit('openBookDetail', tooltip_id)"
          ref="BookDetailTooltipRef"
          :id="tooltip_id"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as d3 from "d3";
import DynastySelector from "@/components/DynastySelector.vue";
import BookDetailTooltip from "@/components/BookDetailTooltip.vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { store } from "@/store";
import { Book } from "#/axios";

const MAX_PARTICLES = 250;
const NUM_PARTICLES = 100;
const PARTICLE_SIZE = 0.5; // View heights
const SPEED = 20000; // 毫秒数

const svg = ref<d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null>(null);
const particles = ref<Particle[]>([]);
const animation_handler = ref(0);
const playing = ref(true);
const curr_time = ref(0);
const particles_original_data = ref([]);
const tooltip_id = ref("");
const curr_comment = ref("");

interface Particle {
  info: Book;
  x: number;
  y: number;
  diameter: number;
  duration: number;
  amplitude: number;
  offsetY: number;
  arc: number;
  startTime: number;
  colour: string;
}

const BookDetailTooltipRef = ref<InstanceType<typeof BookDetailTooltip> | null>(null);

watch(playing, (n) => {
  if (n) BookDetailTooltipRef.value?.close();
});

/**
 * 点击年代名称，切换显示的粒子。
 * 接收子组件传入的对象，包括id列表和要显示的备注
 * @param {Object} o
 */
function changeDynasty(o: { text: string; ids: string[] }) {
  curr_comment.value = o.text;

  // 更新粒子数据
  particles_original_data.value = [];
  o.ids.forEach((id: string) => {
    particles_original_data.value = particles_original_data.value.concat(
      store.state.books.filter((el: Book) => el.edition_dynasty_id == id)
    );
  });

  // 清零
  svg.value?.html("");
  particles.value = [];
  curr_time.value = 0;

  // 如果粒子数量太多，只显示其中一部分
  if (particles_original_data.value.length > MAX_PARTICLES) {
    let temp_arr = JSON.parse(JSON.stringify(particles_original_data.value));
    particles_original_data.value = [];
    for (let i = 0; i < MAX_PARTICLES; i++) particles_original_data.value.push(temp_arr.pop());
  }

  // 生成某数量的粒子
  for (let e of particles_original_data.value) particles.value.push(generateParticleData(e));

  // 绘制
  svg.value?.selectAll("circle").data(particles.value).enter().append("circle");

  if (!playing.value) {
    animation_handler.value = requestAnimationFrame(draw);
    playing.value = true;
  }
}

function pause() {
  if (playing.value) {
    cancelAnimationFrame(animation_handler.value);
    playing.value = false;
  }
}

function continuePlay() {
  if (!playing.value) {
    animation_handler.value = requestAnimationFrame(draw);
    playing.value = true;
  }
}

function togglePause() {
  if (playing.value) pause();
  else continuePlay();
}

function normalPool(o) {
  let r = 0;
  do {
    let a = Math.round(this.normal({ mean: o.mean, dev: o.dev }));
    if (a < o.pool.length && a >= 0) return o.pool[a];
    r++;
  } while (r < 100);
}

function randomNormal(o: { mean: number; dev: number }) {
  if (((o = Object.assign({ mean: 0, dev: 1, pool: [] }, o)), Array.isArray(o.pool) && o.pool.length > 0))
    return normalPool(o);
  let r,
    a,
    n,
    e,
    l = o.mean,
    t = o.dev;
  do r = (a = 2 * Math.random() - 1) * a + (n = 2 * Math.random() - 1) * n;
  while (r >= 1);
  return (e = a * Math.sqrt((-2 * Math.log(r)) / r)), t * e + l;
}

function rand(low: number, high: number) {
  return Math.random() * (high - low) + low;
}

// 根据古籍数据，生成粒子
function generateParticleData(e: Book): Particle {
  const colour = {
    r: 60,
    g: randomNormal({ mean: 50, dev: 20 }),
    b: 50,
    a: rand(0.2, 0.5),
  };
  return {
    info: e,
    x: -2,
    y: -2,
    diameter:
      0.3 +
      Math.max(
        0,
        randomNormal({
          mean: PARTICLE_SIZE,
          dev: PARTICLE_SIZE / 2,
        })
      ),
    duration: randomNormal({
      mean: SPEED,
      dev: SPEED * 0.1,
    }),
    amplitude: randomNormal({ mean: 16, dev: 2 }),
    offsetY: randomNormal({ mean: 0, dev: 10 }),
    arc: Math.PI * 2,
    startTime: curr_time.value - rand(0, SPEED),
    colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
  };
}

// 计算粒子的新位置
function moveParticle(particle: Particle) {
  const progress = ((curr_time.value - particle.startTime) % particle.duration) / particle.duration;
  return {
    ...particle,
    x: progress,
    y: Math.sin(progress * particle.arc) * particle.amplitude + particle.offsetY,
  };
}

// 每帧绘制的内容
function draw() {
  // 动画句柄，用来控制播放
  animation_handler.value = requestAnimationFrame(draw);

  // 更新粒子位置数据
  particles.value.forEach((particle, index) => {
    particles.value[index] = moveParticle(particle);
  });

  // 根据数据更新粒子位置
  const vh = svg.value.attr("height") / 100;
  svg.value
    ?.selectAll("circle")
    .data(particles.value)
    .attr("fill", (e) => e.colour)
    .attr("cx", (e) => e.x * svg.value.attr("width"))
    .attr("cy", (e) => e.y * vh + svg.value.attr("height") / 2)
    .attr("r", (e) => e.diameter * vh)
    .attr("cursor", "pointer");

  // 交互
  svg.value?.selectAll("circle").on("click", (e: MouseEvent, d) => {
    pause();
    event.stopPropagation();
    BookDetailTooltipRef.value.$el.style.left = e.clientX + 30 + "px";
    BookDetailTooltipRef.value.$el.style.top = e.clientY - 140 + "px";
    BookDetailTooltipRef.value.$el.style.display = "block";
    BookDetailTooltipRef.value.open();
    tooltip_id.value = d.info.id;
  });

  // 计时器
  curr_time.value += 16;
}

function start() {
  // 配置画布
  svg.value = d3
    .select("#particles-svg")
    .attr("width", window.innerWidth * 0.9)
    .attr("height", window.innerHeight * 0.8);

  // 生成某数量的粒子
  for (let i = 0; i < NUM_PARTICLES; i++)
    particles_original_data.value.push(store.state.books[Math.floor(Math.random() * store.state.books.length)]);

  for (let e of particles_original_data.value) particles.value.push(generateParticleData(e));

  // 绘制
  svg.value.selectAll("circle").data(particles.value).enter().append("circle");

  // 动画
  draw();
}
onMounted(() => {
  if (document.readystate !== "loading") start();
  else
    document.addEventListener("DOMContentLoaded", () => {
      start();
    });
  pause();
});

onUnmounted(() => {
  cancelAnimationFrame(animation_handler.value);
});

defineExpose({
  continuePlay,
  pause,
});
</script>

<style lang="less" scoped>
#flow {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 90%;
    height: 80%;
    display: flex;
    align-items: center;
    .main {
      position: relative;
      border: 0.1rem solid #201d1d;
      .comment {
        position: absolute;
        bottom: 1.5rem;
        left: 1rem;
        font-size: 0.7rem;
      }

      .togglePause {
        user-select: none;
        background: url(../../assets/icons/pause.svg) center no-repeat;
        background-size: 30%;
        border: 0.13rem solid #201d1d;
        cursor: pointer;
        position: absolute;
        right: 2rem;
        bottom: 1.5rem;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        opacity: 0.6;
      }
      .togglePause.continue {
        background: url(../../assets/icons/continue.svg) center no-repeat;
        background-size: 30%;
      }
    }
  }
}
</style>
