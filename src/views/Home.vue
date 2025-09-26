<template>
  <div class="home">
    <div class="bg" />
    <div class="bottom-box">
      <router-link to="/profile" class="btn">进入下一页面</router-link>
    </div>

    <!-- 显示配置 -->
    <div v-if="configData" class="config-display">
      <pre>{{ JSON.stringify(configData, null, 2) }}</pre>
    </div>
    <div v-else-if="loading" class="config-display">
      加载配置中...
    </div>
    <div v-else class="config-display">
      无法加载配置
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const configData = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      configData.value = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch config:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.bg {
  position: absolute;
  inset: 0;
  background: url('/back01.png') center/cover no-repeat;
  z-index: 1;
}
.bottom-box {
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  z-index: 2;
}
.btn {
  display: inline-block;
  padding: 0.9rem 2.2rem;
  font-size: 1.2rem;
  color: #fff;
  text-decoration: none;
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
}
.btn:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}
.btn:active {
  transform: translateY(0);
}

.config-display {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  z-index: 3;
  max-width: 300px;
  word-wrap: break-word;
}
</style>