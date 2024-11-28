<template>
<!-- 全局配置 -->
<el-config-provider :locale="locale" :message="config">
 <router-view />   
</el-config-provider> 
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const locale=zhCn;
const config=reactive({
    max:1,
    })
</script>

<style scoped>

</style>
