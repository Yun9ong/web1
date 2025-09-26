<template>
  <div class="photo-page">
    <!-- 背景图 -->
    <img class="bg" src="/back03.jpg" loading="lazy" alt="bg" />

    <!-- 左上角返回 -->
    <router-link to="/profile" class="back-btn">← 返回上一页</router-link>

    <!-- 顶部工具栏 -->
    <div class="top-bar">
      <label class="bar-btn add">
        <input type="file" accept="image/*" multiple @change="addPhotos" hidden />
        新增照片
      </label>
      <button class="bar-btn refresh" @click="refreshGallery">刷新</button>
    </div>

    <!-- 照片网格 -->
    <div class="grid" ref="grid">
      <div
        v-for="(src, idx) in galleryList"
        :key="src"
        class="cell"
        @click="showSingle(src)"
      >
        <img :src="src" class="cell-img" loading="lazy" />
        <div class="del-overlay" @click.stop="removePhoto(idx)">
          <span>删除</span>
        </div>
      </div>
    </div>

    <!-- 单张放大 -->
    <Transition name="fade">
      <div v-if="single" class="single-mask" @click="single = ''">
        <img :src="single" class="single-img" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const galleryList = ref([])   // 最终展示列表
const single = ref('')        // 放大图地址

/* ===== 扫描 gallery 目录 ===== */
// Vite 只能显式 import.meta.glob，这里用正则一次性拿到 public/gallery/ 下所有图片
const modules = import.meta.glob('/public/gallery/*.{jpg,jpeg,png,gif,webp}')
const DEFAULT = Object.keys(modules).map(p => p.replace('/public', '')) // 去掉 /public 前缀

/* ===== 初始化 ===== */
onMounted(() => {
  const saved = localStorage.getItem('gallery_list')
  galleryList.value = saved ? JSON.parse(saved) : DEFAULT
})

/* ===== 增 / 删 / 刷新 ===== */
// 1. 本地选图上传
async function addPhotos(e) {
  const files = Array.from(e.target.files)
  for (const file of files) {
    // 简单重命名：时间戳 + 原后缀
    const name = `${Date.now()}-${file.name}`.replace(/\s/g, '-')
    const url = `/gallery/${name}`

    // 真正上传：这里演示用 base64 写 localStorage（小图够用）
    // 生产环境建议调用后端或 Vercel blob
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      localStorage.setItem(name, reader.result) // 存 base64
      galleryList.value.push(url)
      saveList()
    }
  }
}

// 2. 删除
function removePhoto(idx) {
  if (galleryList.value.length <= 1) return alert('至少保留一张图片')
  const target = galleryList.value[idx]
  localStorage.removeItem(target.split('/').pop()) // 同时删 base64
  galleryList.value.splice(idx, 1)
  saveList()
}

// 3. 刷新（重新扫描 + 同步本地缓存）
function refreshGallery() {
  const saved = localStorage.getItem('gallery_list')
  galleryList.value = saved ? JSON.parse(saved) : DEFAULT
  saveList()
}

// 持久化
function saveList() {
  localStorage.setItem('gallery_list', JSON.stringify(galleryList.value))
}

/* 单张放大 */
function showSingle(src) {
  single.value = src
}
</script>

<style scoped>
/* ===== 全屏背景 ===== */
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

/* ===== 顶部工具栏 ===== */
.top-bar {
  position: relative;
  z-index: 3;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.bar-btn {
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}
.bar-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* ===== 网格：固定宽度 + 自适应列数 ===== */
.grid {
  position: relative;
  z-index: 3;
  width: 90%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.cell {
  position: relative;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: zoom-in;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.cell:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.cell-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 删除遮罩 */
.del-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
}
.cell:hover .del-overlay {
  opacity: 1;
}

/* 单张放大 */
.single-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: rgba(0, 0, 0, 0.85);
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
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 手机适配 */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.6rem;
  }
  .bar-btn {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}
</style>