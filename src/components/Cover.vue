<template>
    <div class="cover" :style="{width:width+'px',height:width+'px'}">
       <el-image :style="{width:width+'px',height:width+'px'}" fit="scale-down" loading="lazy"
       :src="proxy.globalInfo.imageUrl + cover ">
       </el-image>
    </div>
</template>

<script setup>
import {ref,reactive, getCurrentInstance, onMounted,watch} from "vue"
const {proxy} =getCurrentInstance(); //全局this
const localCover=new URL("@/assets/default.jpg",import.meta.url).href//用图片的定义路径方式
const props=defineProps({
    cover:{
        type:String
    },
    width:{
        type:Number,
        default:60
    }
})
</script>

<style lang="scss">
.cover {
  background: #ddd;
  border-radius: 5px;
  overflow: hidden;
}
</style>