<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import { select } from "d3";
import { Book } from "#/axios";

import DynastySelector from "@/components/introduction/DynastySelector.vue";
import BookDetailTooltip from "@/components/introduction/BookDetailTooltip.vue";
import { useStore } from "@/store";

interface ParticleData {
  x: number;
  y: number;
  info: Book;
  diameter: number;
  duration: number;
  amplitude: number;
  offsetY: number;
  arc: number;
  startTime: number;
  color: string;
}

const MAX_PARTICLES = 250;
const NUM_PARTICLES = 100;
const PARTICLE_SIZE = 0.5;
const SPEED = 20000;

const d3 = { select };

let animation_handler = 0;
let curr_time = 0;

const store = useStore();
const emits = defineEmits(["openBookDetail"]);
const books = inject("introductionData").value[0];

const svg = ref<d3.Selection<SVGSVGElement, unknown, null, any> | null>(null);
const particles = ref<ParticleData[]>([]);
const playing = ref(true);
const particles_original_data = ref<Book[]>([]);
const curr_comment = ref("");
const tooltipPosition = ref({
  left: 0,
  top: 0,
});

const BookDetailTooltipRef = ref<InstanceType<typeof BookDetailTooltip> | null>(null);

watch(playing, (n) => {
  if (n) BookDetailTooltipRef.value?.close();
});

/**
 * 点击年代名称，切换显示的粒子。
 * 接收子组件传入的对象，包括id列表和要显示的备注
 * @param {Object} o
 */
async function changeDynasty(o: { text: string; ids: string[] }) {
  curr_comment.value = o.text;

  // 更新粒子数据
  particles_original_data.value = [];
  o.ids.forEach((id: string) => {
    particles_original_data.value = particles_original_data.value.concat(books.filter((el: Book) => el.edition_dynasty_id == id));
  });

  // 清零
  svg.value?.html("");
  particles.value = [];
  curr_time = 0;

  // 如果粒子数量太多，只显示其中一部分
  if (particles_original_data.value.length > MAX_PARTICLES) {
    let temp_arr: Book[] = JSON.parse(JSON.stringify(particles_original_data.value));
    particles_original_data.value = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      let temp = temp_arr.pop();
      if (temp) particles_original_data.value.push(temp);
    }
  }

  // 生成某数量的粒子
  for (let e of particles_original_data.value) particles.value.push(generateParticleData(e));

  // 绘制
  svg.value?.selectAll("circle").data(particles.value).enter().append("circle");

  if (!playing.value) {
    animation_handler = requestAnimationFrame(draw);
    playing.value = true;
  }
}

function pause() {
  if (playing.value) {
    cancelAnimationFrame(animation_handler);
    playing.value = false;
  }
}

function continuePlay() {
  if (!playing.value) {
    animation_handler = requestAnimationFrame(draw);
    playing.value = true;
  }
}

function togglePause() {
  if (playing.value) pause();
  else continuePlay();
}

function randomNormal(o: { mean: number; dev: number }) {
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

// 生成范围在[low, high)的随机数
function rand(low: number, high: number) {
  return Math.random() * (high - low) + low;
}

// 根据古籍数据，生成粒子
function generateParticleData(e: Book): ParticleData {
  const color = {
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
    startTime: curr_time - rand(0, SPEED),
    color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
  };
}

// 计算粒子的新位置
function moveParticle(particle: ParticleData): ParticleData {
  const progress = ((curr_time - particle.startTime) % particle.duration) / particle.duration;
  return {
    ...particle,
    x: progress,
    y: Math.sin(progress * particle.arc) * particle.amplitude + particle.offsetY,
  };
}

// 每帧绘制的内容
function draw() {
  animation_handler = requestAnimationFrame(draw);

  // 更新粒子位置数据
  particles.value.forEach((particle, index) => {
    particles.value[index] = moveParticle(particle);
  });

  // 根据数据更新粒子位置
  const vh = parseInt(svg.value!.attr("height")) / 100;
  svg
    .value!.selectAll("circle")
    .data(particles.value)
    .attr("fill", (e) => e.color)
    .attr("cx", (e) => e.x * parseInt(svg.value!.attr("width")))
    .attr("cy", (e) => e.y * vh + parseInt(svg.value!.attr("height")) / 2)
    .attr("r", (e) => e.diameter * vh)
    .attr("cursor", "pointer");

  // 点击圆点，显示BookDetailTooltip
  svg.value?.selectAll("circle").on("click", (e: MouseEvent, d): void => {
    pause();
    e.stopPropagation();
    const { left: svg_left, top: svg_top } = svg.value!.node()!.getBoundingClientRect();

    let tooltipLeft = e.clientX - svg_left + 30,
      tooltipTop = e.clientY - svg_top - 50;
    if (e.clientX + 15 * store.rem > window.innerWidth) tooltipLeft = e.clientX - 15 * store.rem - svg_left - 30;

    tooltipPosition.value = { left: tooltipLeft, top: tooltipTop };
    BookDetailTooltipRef.value!.open(d.info.id);
  });

  // 计时器
  curr_time += 16;
}

async function start() {
  // 配置画布
  svg.value = d3
    .select("#particles-svg")
    .attr("width", window.innerWidth * 0.9)
    .attr("height", window.innerHeight * 0.8);

  // 生成某数量的粒子
  for (let i = 0; i < NUM_PARTICLES; i++) particles_original_data.value.push(books[Math.floor(Math.random() * books.length)]);

  for (let e of particles_original_data.value) particles.value.push(generateParticleData(e));

  // 绘制
  svg.value!.selectAll("circle").data(particles.value).enter().append("circle");

  // 动画
  draw();
  pause();
}

function openBookDetail(book_id: string) {
  emits("openBookDetail", book_id);
}

onMounted(() => {
  if (document.readyState !== "loading") start();
  else
    document.addEventListener("DOMContentLoaded", () => {
      start();
    });

  window.addEventListener("resize", () => {
    d3.select("#particles-svg")
      .attr("width", window.innerWidth * 0.9)
      .attr("height", window.innerHeight * 0.8);
  });
});

onUnmounted(() => {
  cancelAnimationFrame(animation_handler);
});

defineExpose({
  continuePlay,
  pause,
});
</script>

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
        <BookDetailTooltip @openBookDetail="openBookDetail" :position="tooltipPosition" ref="BookDetailTooltipRef" />
      </div>
    </div>
  </div>
</template>

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
