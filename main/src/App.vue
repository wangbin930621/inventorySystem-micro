<template>
  <div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <!-- 子应用容器，测试用 -->
    <div id="sub-container"></div>
  </div>
  
</template>

<script>
  export default {
  }
</script>
