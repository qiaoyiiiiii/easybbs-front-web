<template>
    <div class="no-data">
        <div class="iconfont icon-nothing">
            <div class="msg">{{msg}}</div>
        </div>
    </div>
</template>

<script setup>
const props=defineProps({
    msg:{
        type:String
    }
})
</script>

<style lang="scss">
.no-data{
    text-align: center;
    padding: 10px 0;
    .iconfont{
        font-size: 50px;
        color: #ddd;
    }
    .msg{
        font-size: 14px;
        color: #909399;
        margin-top: 10px;
    }
}
</style>
