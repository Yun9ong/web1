<template>
  <div class="home">
    <div class="bg" />
    <div class="bottom-box">
      <router-link to="/profile" class="btn">进入下一页面</router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.home{position:relative;width:100%;height:100vh;overflow:hidden;}
.bg{position:absolute;inset:0;background:url('/back01.png') center/cover no-repeat;z-index:1;}
.bottom-box{position:absolute;left:50%;bottom:10%;transform:translateX(-50%);z-index:2;}
.btn{display:inline-block;padding:.9rem 2.2rem;font-size:1.2rem;color:#fff;text-decoration:none;border-radius:50px;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.35);box-shadow:0 4px 20px rgba(0,0,0,.25);transition:all .3s ease;}
.btn:hover{background:rgba(0,0,0,.4);transform:translateY(-2px);}
.btn:active{transform:translateY(0);}
</style>