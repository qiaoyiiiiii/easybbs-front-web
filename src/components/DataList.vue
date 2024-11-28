<template>
<div v-if="!loading&&dataSource.list!=null&&dataSource.list.length==0">
    <NoData :msg="noDataMsg"></NoData>
</div>
<div class="skeleton" v-if="loading">
<el-skeleton :row="2" animated>
</el-skeleton> 
</div>   
<div v-for="item in dataSource.list" :key="item.index" v-else>
<slot :data="item"></slot>
</div>
    <div class="pagination">
        <el-pagination
        v-if="dataSource.pageTotal > 1"
        background
        :total="dataSource.totalCount"
        v-model.sync="dataSource.pageNo"
        layout="prev,pager,next"
        @current-change="handlePageNoChange"
        >
        </el-pagination>
    </div>
</template>

<script setup>
const props=defineProps({
    dataSource:{
        type:Object
    },
    loading:{
        type:Boolean,
    },
    noDataMsg:{
        type:String,
        default:"暂无数据"
    }
})
const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  emit("loadData");
}
</script>

<style lang="scss">
.pagination{
    padding: 10px 0 10px 0px;
    float: right;
}
</style>