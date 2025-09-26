<template>
  <div class="home-container">
    <div class="content-box">
      <h1 class="brand">云松</h1>
      <button class="next-btn" @click="goToNextPage">进入下一页</button>
    </div>
  </div>
</template>

<script setup>
/* Vue3 语法，如用 Vue2 把 <script setup> 换回 export default 即可 */
import { useRouter } from 'vue-router'
const router = useRouter()
const goToNextPage = () => router.push('/info')
</script>

<style scoped>
/* ====== 1. 背景层 ====== */
.home-container {
  /* 铺满视口 */
  width: 100vw;
  height: 100vh;
  /* 背景图永远固定在视口，不随内容滚动 */
  background: url(@/assets/back2.png) center/cover no-repeat fixed;
  /* 防止移动端出现横向滚动条 */
  overflow: hidden;
  /* 弹性居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ====== 2. 内容层 ====== */
.content-box {
  /* 让内部元素垂直紧密排列 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;                 /* 关键：紧凑间距，视觉舒适 */
  /* 毛玻璃 + 半透明底 */
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px); /* 兼容 Safari */
  border-radius: 16px;
  padding: 3vh 6vw;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  color: #fff;
  font-family: Georgia, serif;
  /* 防止过宽 */
  max-width: 90vw;
  min-width: 280px;
}

/* ====== 3. 文字 & 按钮 ====== */
.brand {
  margin: 0;                /* 去掉浏览器默认 margin */
  font-size: clamp(2rem, 3vw + 1rem, 4rem);
  letter-spacing: 0.05em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.next-btn {
  margin: 0;
  padding: 10px 28px;
  font-size: clamp(0.9rem, 1vw + 0.4rem, 1.1rem);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.next-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}
.next-btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
</style>