<template>
  <div class="home">
    <!-- 背景图 -->
    <div class="bg" />

    <!-- 中间按钮 -->
    <div class="center-btn">
      <router-link to="/profile" class="btn">进入下一页面</router-link>
    </div>

    <!-- 配置信息展示区 -->
    <div class="config-card" :class="{ expand: isExpand }">
      <!-- 摘要行 -->
      <div class="summary" @click="isExpand = !isExpand">
        <span class="title">配置详情</span>
        <span class="status" :class="statusType">{{
          loading ? '加载中…' : configData ? '已加载' : '加载失败'
        }}</span>
        <span class="caret">{{ isExpand ? '▼' : '▶' }}</span>
      </div>

      <!-- 展开区 -->
      <transition name="slide">
        <div v-if="isExpand" class="detail">
          <div class="toolbar">
            <span class="copy" @click="copyConfig">复制</span>
            <span class="close" @click="isExpand = false">收起</span>
          </div>
          <pre class="code">{{ content }}</pre>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const configData = ref(null)
const loading = ref(true)
const isExpand = ref(false)

// 加载配置
fetch('/api/config')
  .then(r => (r.ok ? r.json() : Promise.reject(r)))
  .then(d => (configData.value = d))
  .catch(() => (configData.value = null))
  .finally(() => (loading.value = false))

// 计算状态样式
const statusType = computed(() =>
  loading.value ? 'loading' : configData.value ? 'success' : 'error'
)

// 计算展示文本
const content = computed(() =>
  loading.value
    ? '配置加载中，请稍候…'
    : configData.value
    ? JSON.stringify(configData.value, null, 2)
    : '❌ 配置加载失败，请检查网络或接口权限。'
)

// 复制功能
async function copyConfig() {
  try {
    await navigator.clipboard.writeText(content.value)
    alert('已复制到剪贴板')
  } catch {
    alert('复制失败，请手动选择')
  }
}
</script>

<style scoped>
/* ---------- 背景图 ---------- */
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('./back01.png');
  background-size: cover;
  background-position: center;
  z-index: 1;
}

/* ---------- 整体容器 ---------- */
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* ---------- 中间按钮 ---------- */
.center-btn {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.btn {
  display: inline-block;
  padding: 14px 32px;
  font-size: 16px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

/* ---------- 配置卡片 ---------- */
.config-card {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 3;
  width: 320px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.config-card.expand {
  width: 420px;
}

/* ---------- 摘要行 ---------- */
.summary {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
}
.title {
  flex: 1;
  font-size: 15px;
  color: #fff;
  font-weight: 500;
}
.status {
  font-size: 13px;
  margin-right: 8px;
  padding: 2px 8px;
  border-radius: 10px;
  color: #fff;
}
.status.loading { background: #888; }
.status.success { background: #52c41a; }
.status.error { background: #ff4d4f; }
.caret {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  transition: transform 0.3s ease;
}
.config-card.expand .caret {
  transform: rotate(180deg);
}

/* ---------- 展开区 ---------- */
.detail {
  padding: 0 16px 12px;
}
.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}
.copy,
.close {
  cursor: pointer;
  transition: color 0.2s;
}
.copy:hover,
.close:hover {
  color: #fff;
}
.code {
  margin: 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre;
}

/* ---------- 动画 ---------- */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.bg {
  animation: breathe 12s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    filter: brightness(1) saturate(1);
    transform: scale(1);
  }
  50% {
    filter: brightness(1.1) saturate(1.2);
    transform: scale(1.02);
  }
}
.btn {
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s;
}

.btn:hover::before {
  left: 100%;
}
</style>