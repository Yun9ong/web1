<template>
  <div class="profile">
    <!-- 背景 -->
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
    <div class="card">
      <div class="avatar-box">
        <img class="avatar" src="/p1.jpg" loading="lazy" alt="avatar" />
      </div>

      <!-- 固定展示 -->
      <div class="info" v-if="!editing">
        <div class="row"><span class="label">姓名</span><span class="value">{{ name }}</span></div>
        <div class="row"><span class="label">QQ</span><span class="value">{{ qq }}</span></div>
        <div class="row"><span class="label">邮箱</span><span class="value">{{ email }}</span></div>
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
import { ref } from 'vue'

// 读取持久化数据
const name    = ref(localStorage.getItem('profile_name')    || '云松')
const qq      = ref(localStorage.getItem('profile_qq')      || '2944661085')
const email   = ref(localStorage.getItem('profile_email')   || '2944661085@qq.com')
const address = ref(localStorage.getItem('profile_address') || '湖北省武汉市')

const editing = ref(false)
const showTip = ref(false)
const draft   = ref({}) // 编辑临时副本

function startEdit () {
  draft.value = {
    name: name.value,
    qq: qq.value,
    email: email.value,
    address: address.value
  }
  editing.value = true
}

function save () {
  // 落库
  Object.keys(draft.value).forEach(k => {
    localStorage.setItem(`profile_${k}`, draft.value[k])
    ref[k].value = draft.value[k]   // 同步回显
  })
  name.value = draft.value.name
  qq.value = draft.value.qq
  email.value = draft.value.email
  address.value = draft.value.address

  editing.value = false
  showTip.value = true
  setTimeout(() => (showTip.value = false), 1500)
}

function cancel () {
  editing.value = false
}
</script>

<style scoped>
/* ======== 基础布局 ======== */
.profile{
  position:relative;
  width:100%;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:5vh 0;
  overflow:hidden;
}
.bg{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  z-index:1;
}

/* 左上角返回 */
.back-btn{
  position:absolute;
  top:1.2rem;left:1.2rem;
  z-index:4;
  padding:0.5rem 1rem;
  font-size:0.95rem;
  color:#fff;text-decoration:none;
  border-radius:20px;
  background:rgba(0,0,0,.25);
  backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.25);
  box-shadow:0 4px 12px rgba(0,0,0,.2);
  transition:all .3s ease;
}
.back-btn:hover{background:rgba(0,0,0,.4);transform:translateY(-2px);}

/* 顶部一排按钮 */
.top-bar{
  position:relative;
  z-index:3;
  display:flex;
  gap:1rem;
  margin-bottom:3rem;
}
.bar-btn{
  padding:0.6rem 1.4rem;
  font-size:1rem;color:#fff;text-decoration:none;
  border-radius:30px;
  background:rgba(255,255,255,.15);
  backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.25);
  box-shadow:0 4px 20px rgba(0,0,0,.2);
  transition:all .3s ease;
}
.bar-btn:hover{background:rgba(255,255,255,.25);transform:translateY(-2px);}

/* 卡片 */
.card{
  position:relative;z-index:3;
  width:90%;max-width:420px;
  background:rgba(255,255,255,.15);
  backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,.25);
  border-radius:20px;
  box-shadow:0 8px 32px rgba(0,0,0,.25);
  padding:2rem;
  display:flex;flex-direction:column;align-items:center;gap:1.5rem;
}
.avatar-box{width:100px;height:100px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.35);box-shadow:0 4px 12px rgba(0,0,0,.2);}
.avatar{width:100%;height:100%;object-fit:cover;}

/* 信息行 */
.info{width:100%;display:flex;flex-direction:column;gap:1rem;color:#fff;}
.row{display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0.6rem;border-radius:8px;transition:background .3s;}
.row:hover{background:rgba(255,255,255,.1);}
.label{font-weight:600;opacity:0.85;}
.value{text-align:right;}
.input{background:transparent;border:none;color:#fff;text-align:right;outline:none;width:160px;transition:border-color .3s;}
.input:focus{border-color:#fff;}

/* 操作按钮 */
.actions{display:flex;gap:1rem;margin-top:0.6rem;}
.act-btn{padding:0.6rem 1.4rem;font-size:1rem;color:#fff;border-radius:30px;border:none;cursor:pointer;transition:all .3s ease;}
.act-btn{background:rgba(255,255,255,.2);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.25);}
.act-btn:hover{background:rgba(255,255,255,.3);transform:translateY(-2px);}
.act-btn.save{background:rgba(76,175,80,.7);}
.act-btn.save:hover{background:rgba(76,175,80,.9);}
.act-btn.cancel{background:rgba(244,67,54,.7);}
.act-btn.cancel:hover{background:rgba(244,67,54,.9);}

/* 保存弹窗 */
.tip{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);z-index:5;padding:0.6rem 1.4rem;font-size:1rem;color:#fff;background:rgba(0,0,0,.35);backdrop-filter:blur(10px);border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,.25);}
.fade-enter-active,.fade-leave-active{transition:opacity .3s;}
.fade-enter-from,.fade-leave-to{opacity:0;}

/* 手机适配 */
@media (max-width:600px){
  .card{width:92%;padding:1.5rem;}
  .avatar-box{width:80px;height:80px;}
  .input{width:120px;}
  .top-bar{gap:0.6rem;}
  .bar-btn{padding:0.5rem 1rem;font-size:0.9rem;}
}
</style>