<template>
    <div class="image-viewer">
        <el-image-viewer
        :initial-index="previewImgIndex"
        hide-on-click-modal
        :url-list="imageList"
        @close="closeImgViewer"
        v-if="previewImgIndex!=null"
        >
            
        </el-image-viewer>
    </div>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  nextTick,
  onUnmounted,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const props=defineProps({
    imageList:{
        type:Array
    },
})
const previewImgIndex=ref(null)

const show=(index)=>{
    stopScroll()
    previewImgIndex.value=index
}

defineExpose({show})
const closeImgViewer=()=>{
startScroll()
previewImgIndex.value=null
}

//禁止波动
const stopScroll=()=>{
document.body.style.overflow="hidden"
}
//开始滚动
const startScroll=()=>{
document.body.style.overflow="auot"
}
</script>

<style lang="scss">

</style>