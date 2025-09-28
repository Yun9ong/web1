<template>
  <div class="profile" @pointermove="onPointerMove">
    <!-- 动态背景 -->
    <canvas ref="canvas" class="bg-canvas"></canvas>
    <img class="bg" src="/back2.png" loading="lazy" alt="bg" />

    <!-- 左上角返回 -->
    <router-link to="/" class="back-btn">← 返回首页</router-link>

    <!-- 顶部一排外链 -->
    <div class="top-bar">
      <a href="https://space.bilibili.com/481341032" target="_blank" class="bar-btn">B 站</a>
      <a href="https://user.qzone.qq.com/2944661085" target="_blank" class="bar-btn">QQ 空间</a>
      <router-link to="/photo" class="bar-btn">相册集</router-link>
    </div>

    <!-- 个人信息卡片 -->
    <div class="card" ref="card">
      <div class="avatar-box">
        <img class="avatar" src="/p1.jpg" loading="lazy" decoding="async" alt="avatar" />
      </div>

      <!-- 固定展示 -->
      <div class="info" v-if="!editing">
        <div class="row"><span class="label">姓名</span><span class="value">{{ name }}</span></div>
        <div class="row"><span class="label">QQ</span><span class="value">{{ qq }}</span></div>
        <div class="row">
          <span class="label">邮箱</span>
          <a :href="`https://wx.mail.qq.com/home/index?sid=zV1rboz2U3Uugzd2AK9QXwAA#/list/1/1`" target="_blank" class="value email-link">{{ email }}</a>
        </div>
        <div class="row"><span class="label">地址</span><span class="value">{{ address }}</span></div>
      </div>

      <!-- 编辑状态 -->
      <div class="info edit" v-else>
        <div class="row"><span class="label">姓名</span><input class="value input" v-model="draft.name" /></div>
        <div class="row"><span class="label">QQ</span><input class="value input" v-model="draft.qq" /></div>
        <div class="row"><span class="label">邮箱</span><input class="value input" v-model="draft.email" /></div>
        <div class="row"><span class="label">地址</span><input class="value input" v-model="draft.address" /></div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button v-if="!editing" @click="startEdit" class="act-btn">修改信息</button>
        <template v-else>
          <button @click="save" class="act-btn save">保存</button>
          <button @click="cancel" class="act-btn cancel">取消</button>
        </template>
      </div>
    </div>

    <!-- 保存成功弹窗 -->
    <Transition name="fade">
      <div v-if="showTip" class="tip">✅ 已保存</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/* ========== 数据 ========== */
const name    = ref(localStorage.getItem('profile_name')    || '云松')
const qq      = ref(localStorage.getItem('profile_qq')      || '2944661085')
const email   = ref(localStorage.getItem('profile_email')   || '2944661085@qq.com')
const address = ref(localStorage.getItem('profile_address') || '湖北省武汉市')

const editing = ref(false)
const showTip = ref(false)
const draft   = ref({})

/* ========== 粒子背景 ========== */
const canvas = ref(null)
let ctx, particles, rafId
const dpr = window.devicePixelRatio || 1

function initParticles() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  canvas.value.width  = vw * dpr
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
const card = ref(null)
function onPointerMove(e) {
  if (!card.value) return
  const rect = card.value.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) / rect.width
  const y = (e.clientY - rect.top - rect.height / 2) / rect.height
  card.value.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`
}

/* ========== 业务逻辑 ========== */
function startEdit() {
  draft.value = { name: name.value, qq: qq.value, email: email.value, address: address.value }
  editing.value = true
}
function save() {
  localStorage.setItem('profile_name',    draft.value.name)
  localStorage.setItem('profile_qq',      draft.value.qq)
  localStorage.setItem('profile_email',   draft.value.email)
  localStorage.setItem('profile_address', draft.value.address)
  name.value    = draft.value.name
  qq.value      = draft.value.qq
  email.value   = draft.value.email
  address.value = draft.value.address
  editing.value = false
  showTip.value = true
  setTimeout(() => (showTip.value = false), 1500)
}
function cancel() {
  editing.value = false
}

/* ========== 生命周期 ========== */
onMounted(() => initParticles())
onUnmounted(() => stopParticles())
</script>

<style scoped>
/* ========== 原有样式保持不变 ========== */

/* ---------- 变量 ---------- */
:root {
  --neon: #00f6ff;
}

/* ---------- 基础布局 ---------- */
.profile {
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
.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
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
  gap: 1rem;
  margin-bottom: 3rem;
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
  position: relative;
  overflow: hidden;
}
.bar-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}
.bar-btn {
  animation: neon 2s infinite alternate;
}
@keyframes neon {
  from {
    box-shadow: 0 0 4px var(--neon), 0 0 8px var(--neon), inset 0 0 4px var(--neon);
  }
  to {
    box-shadow: 0 0 8px var(--neon), 0 0 16px var(--neon), inset 0 0 8px var(--neon);
  }
}

/* ---------- 卡片 ---------- */
.card {
  position: relative;
  z-index: 3;
  width: 90%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  transform-style: preserve-3d;
  transition: transform 0.2s ease-out;
}
.card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 22px;
  background: conic-gradient(from 0deg, transparent, var(--neon), transparent 30%);
  animation: rotate 6s linear infinite;
  z-index: -1;
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

/* ---------- 头像 ---------- */
.avatar-box {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}
.avatar-box:hover .avatar {
  transform: scale(1.15) rotate(10deg);
}
.avatar-box::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid var(--neon);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

/* ---------- 信息行 ---------- */
.info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #fff;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  transition: background 0.3s;
}
.row:hover {
  background: rgba(255, 255, 255, 0.1);
}
.label {
  font-weight: 600;
  opacity: 0.85;
}
.value {
  text-align: right;
}
.email-link {
  color: var(--neon);
  text-decoration: none;
  transition: color 0.2s;
}
.email-link:hover {
  color: white;
  text-decoration: underline;
}
.input {
  background: transparent;
  border: none;
  color: #fff;
  text-align: right;
  outline: none;
  width: 160px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  transition: border-color 0.3s;
}
.input:focus {
  border-color: var(--neon);
}

/* ---------- 按钮 ---------- */
.actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.6rem;
}
.act-btn {
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  color: #fff;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
.act-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}
.act-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}
.act-btn.save {
  background: rgba(76, 175, 80, 0.7);
}
.act-btn.save:hover {
  background: rgba(76, 175, 80, 0.9);
}
.act-btn.cancel {
  background: rgba(244, 67, 54, 0.7);
}
.act-btn.cancel:hover {
  background: rgba(244, 67, 54, 0.9);
}

/* ---------- 提示 ---------- */
.tip {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---------- 移动端 ---------- */
@media (max-width: 600px) {
  .card {
    width: 92%;
    padding: 1.5rem;
  }
  .avatar-box {
    width: 80px;
    height: 80px;
  }
  .input {
    width: 120px;
  }
  .top-bar {
    gap: 0.6rem;
  }
  .bar-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>