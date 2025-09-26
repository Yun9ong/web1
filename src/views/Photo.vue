<template>
  <div class="photo-page">
    <!-- 背景图 -->
    <img class="bg" src="/back03.jpg" loading="lazy" alt="bg" />

    <!-- 左上角返回 -->
    <router-link to="/profile" class="back-btn">← 返回上一页</router-link>

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
        :class="{ active: delMode && selected.has(idx) }"
        @click="delMode ? toggleSelect(idx) : showSingle(src)"
      >
        <img :src="src" class="cell-img" loading="lazy" />
        <transition name="fade">
          <div v-if="delMode" class="del-badge" @click.stop="removePhoto(idx)">✕</div>
        </transition>
      </div>
    </div>

    <!-- 单张放大 -->
    <transition name="fade">
      <div v-if="single" class="single-mask" @click="single = ''">
        <img :src="single" class="single-img" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const galleryList = ref([])
const single = ref('')
const delMode = ref(false)
const selected = ref(new Set())          // 删除模式下已选索引

/* ===== 初始扫描 ===== */
const modules = import.meta.glob('/public/gallery/*.{jpg,jpeg,png,gif,webp}')
const DEFAULT = Object.keys(modules).map(p => p.replace('/public', ''))

onMounted(() => {
  const saved = localStorage.getItem('gallery_list')
  galleryList.value = saved ? JSON.parse(saved) : DEFAULT
})

/* ===== 新增 ===== */
function addPhotos(e) {
  const files = Array.from(e.target.files)
  files.forEach(file => {
    const url = URL.createObjectURL(file)   // 内存 URL，立即显示
    galleryList.value.push(url)
  })
  saveList()
  e.target.value = ''                       // 允许重复选同一张
}

/* ===== 删除 ===== */
function toggleSelect(idx) {
  selected.value.has(idx) ? selected.value.delete(idx) : selected.value.add(idx)
}
function removePhoto(idx) {
  if (galleryList.value.length <= 1) return alert('至少保留一张图片')
  galleryList.value.splice(idx, 1)
  selected.value.delete(idx)
  saveList()
}

/* ===== 刷新 ===== */
function refreshGallery() {
  const saved = localStorage.getItem('gallery_list')
  galleryList.value = saved ? JSON.parse(saved) : DEFAULT
  selected.value.clear()
  saveList()
}

/* ===== 持久化 ===== */
function saveList() {
  // 仅保存路径；本地新增的图片为 blob: 地址，刷新会丢失，生产环境请对接后端
  localStorage.setItem('gallery_list', JSON.stringify(galleryList.value))
}

/* ===== 放大 ===== */
function showSingle(src) {
  single.value = src
}
</script>

<style scoped>
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
}
.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 4px solid transparent;
}
.cell:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
.cell-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.cell.active {
  border-color: #f44336;
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
}

/* ---------- 单张放大 ---------- */
.single-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
   background: rgba(0,0,0,.85);
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
  box-shadow: 0 8px 32px rgba(0,0,0,.6);
}

/* ---------- 动画 ---------- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---------- 移动端 ---------- */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: .6rem;
  }
  .bar-btn {
    font-size: .9rem;
    padding: .5rem 1rem;
  }
}
</style>