<template>
  <div class="photo-page" @pointermove="onPointerMove">
    <!-- 动态背景 -->
    <canvas ref="canvas" class="bg-canvas"></canvas>

    <!-- 左上角返回 -->
    <router-link to="/profile" class="back-btn">
      <span>← 返回上一页</span>
    </router-link>

    <!-- 顶部操作栏 -->
    <div class="top-bar">
      <label class="bar-btn add">
        <input type="file" accept="image/*" multiple @change="addPhotos" hidden />
        新增照片
      </label>
      <button class="bar-btn" :class="{ danger: delMode }" @click="delMode = !delMode">
        {{ delMode ? '退出删除' : '删除照片' }}
      </button>
      <button class="bar-btn refresh" @click="refreshGallery">刷新</button>
    </div>

    <!-- 照片网格 -->
    <div class="grid" ref="grid">
      <div
        v-for="(src, idx) in galleryList"
        :key="src"
        class="cell"
        :class="{ active: delMode && selected.has(idx), 'tilt-in': true }"
        v-lazy="src"
        @click="delMode ? toggleSelect(idx) : showSingle(src)"
      >
        <img :data-src="src" class="cell-img" loading="lazy" decoding="async" />
        <transition name="pop">
          <div v-if="delMode" class="del-badge" @click.stop="removePhoto(idx)">✕</div>
        </transition>
      </div>
      <!-- 虚拟滚动占位 -->
      <div class="phantom" :style="{ height: phantomHeight + 'px' }"></div>
    </div>

    <!-- 单张放大 -->
    <transition name="zoom">
      <div v-if="single" class="single-mask" @click="single = ''">
        <img :src="single" class="single-img" />
      </div>
    </transition>
  </div>
</template>

<script setup>
/* ========== 基础引入 ========== */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

/* ========== 响应式数据 ========== */
const router = useRouter()
const galleryList = ref([])
const single = ref('')
const delMode = ref(false)
const selected = ref(new Set())
const grid = ref(null)
const canvas = ref(null)

/* ========== 粒子背景 ========== */
let ctx, particles, rafId
const dpr = window.devicePixelRatio || 1
function initParticles() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  canvas.value.width = vw * dpr
  canvas.value.height = vh * dpr
  ctx = canvas.value.getContext('2d')
  ctx.scale(dpr, dpr)

  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * vw,
    y: Math.random() * vh,
    r: Math.random() * 1.2 + 0.4,
    vx: Math.random() * 0.4 + 0.1,
    vy: Math.random() * 0.4 + 0.1,
    opacity: Math.random() * 0.6 + 0.2
  }))
  runParticles()
}
function runParticles() {
  ctx.clearRect(0, 0, canvas.value.width / dpr, canvas.value.height / dpr)
  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    if (p.x > window.innerWidth + 5) p.x = -5
    if (p.y > window.innerHeight + 5) p.y = -5
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`
    ctx.fill()
  })
  rafId = requestAnimationFrame(runParticles)
}
function stopParticles() {
  cancelAnimationFrame(rafId)
}

/* ========== 3D 鼠标倾斜 ========== */
const mouse = { x: 0, y: 0 }
function onPointerMove(e) {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 20
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 20
  document.documentElement.style.setProperty('--mx', mouse.x + 'deg')
  document.documentElement.style.setProperty('--my', mouse.y + 'deg')
}

/* ========== 懒加载指令 ========== */
const vLazy = {
  mounted(el, binding) {
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          const img = el.querySelector('.cell-img')
          img.src = binding.value
          io.disconnect()
        }
      },
      { threshold: 0.01 }
    )
    io.observe(el)
  }
}

/* ========== 初始数据 ========== */
const modules = import.meta.glob('/public/gallery/*.{jpg,jpeg,png,gif,webp}')
const DEFAULT = Object.keys(modules).map(p => p.replace('/public', ''))

onMounted(() => {
  const saved = localStorage.getItem('gallery_list')
  galleryList.value = saved ? JSON.parse(saved) : DEFAULT
  initParticles()
})
onUnmounted(() => stopParticles())

/* ========== 业务逻辑 ========== */
function addPhotos(e) {
  const files = Array.from(e.target.files)
  files.forEach(file => {
    const url = URL.createObjectURL(file)
    galleryList.value.push(url)
  })
  saveList()
  e.target.value = ''
}
function toggleSelect(idx) {
  selected.value.has(idx) ? selected.value.delete(idx) : selected.value.add(idx)
}
function removePhoto(idx) {
  if (galleryList.value.length <= 1) return alert('至少保留一张图片')
  galleryList.value.splice(idx, 1)
  selected.value.delete(idx)
  saveList()
}
function refreshGallery() {
  const saved = localStorage.getItem('gallery_list')
  galleryList.value = saved ? JSON.parse(saved) : DEFAULT
  selected.value.clear()
}
function saveList() {
  localStorage.setItem('gallery_list', JSON.stringify(galleryList.value))
}
function showSingle(src) {
  single.value = src
}

/* ========== 虚拟滚动预留 ========== */
const phantomHeight = ref(0)
nextTick(() => {
  const row = Math.ceil(galleryList.value.length / 6) /* 6 列 */
  phantomHeight.value = row * (160 + 16) /* 160 卡片高 + 16 gap */
})
</script>

<style scoped>
/* ---------- 变量 ---------- */
:root {
  --mx: 0deg;
  --my: 0deg;
}

/* ---------- 基础布局 ---------- */
.photo-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5vh 0;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
}
.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* ---------- 返回按钮 ---------- */
.back-btn {
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  z-index: 10;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  color: #fff;
  text-decoration: none;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}
.back-btn:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

/* ---------- 顶部栏 ---------- */
.top-bar {
  position: relative;
  z-index: 3;
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}
.bar-btn {
  position: relative;
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  color: #fff;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}
.bar-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}
.bar-btn.danger {
  background: rgba(244, 67, 54, 0.25);
  border-color: rgba(244, 67, 54, 0.4);
}
.bar-btn.danger:hover {
  background: rgba(244, 67, 54, 0.4);
}
/* 波纹 */
.bar-btn::after {
  content: '';
  position: absolute;
  inset: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}
.bar-btn:active::after {
  width: 300px;
  height: 300px;
}

/* ---------- 网格 ---------- */
.grid {
  position: relative;
  z-index: 3;
  width: 90%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
.cell {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: zoom-in;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: rotateX(var(--my)) rotateY(var(--mx)) scale(1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 4px solid transparent;
}
.cell:hover {
  transform: rotateX(0) rotateY(0) scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}
.cell-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s;
}
.cell:hover .cell-img {
  transform: scale(1.1);
}
.cell.active {
  animation: pulse 1.2s infinite;
}
@keyframes pulse {
  0% {
    border-color: #f44336;
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.6);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(244, 67, 54, 0);
  }
  100% {
    border-color: #f44336;
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

/* ---------- 删除角标 ---------- */
.del-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f44336;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}
.del-badge:hover {
  transform: scale(1.2) rotate(90deg);
}
.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s;
}
.pop-enter-from,
.pop-leave-to {
  transform: scale(0) rotate(-180deg);
  opacity: 0;
}

/* ---------- 单张放大 ---------- */
.single-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}
.single-img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  animation: zoomIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.zoom-enter-active,
.zoom-leave-active {
  transition: opacity 0.4s;
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
}

/* ---------- 虚拟占位 ---------- */
.phantom {
  grid-column: 1 / -1;
}

/* ---------- 移动端 ---------- */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.6rem;
  }
  .bar-btn {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}
</style>