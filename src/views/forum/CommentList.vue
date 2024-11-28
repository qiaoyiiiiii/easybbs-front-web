<template>
    <div class="comment-body">
        <div class="comment-title">
            <div class="title">评论<span class="count">{{commentListInfo.totalCount}}</span></div>
            <div class="tab">
                <span class="[tab-item,orderType==0?'active':'']"  @click="orderChange(0)">热榜</span>
                <el-divider direction="vertical"></el-divider>
                <span class="[tab-item,orderType==1?'active':'']" @click="orderChange(1)">最新</span>
            </div>
        </div>
        <!-- 发送评论 -->
        <div class="comment-form-panel">
            <PostComment 
            :articleId="articleId"
            :replyUserId="currentUserInfo.userId"
            :pCommentId="0"
            :avatarWidth="50"
            :userId="currentUserInfo.userId"
            :showInsertImg="currentUserInfo.userId!=null"
            @postCommentFinish="postCommentFinish"></PostComment>
        <div class="comment-list">
            <DataList 
            :dataSource="commentListInfo"
            :loading="loading"
            @loadData="loadComment">
            <template #default="{ data }">
            <CommentListItem 
            :articleId="articleId"
            :commentData="data"
            :articleUserId="articleUserId"
            :currentUserId="currentUserInfo.userId"
            @hiddenAllReply="hiddenAllReplyHandler"
            @reloadData="loadComment"
           ></CommentListItem>
            </template>
            </DataList>
        </div>
    </div>
    </div>
</template>

<script setup>
import PostComment from "./PostComment.vue";
import CommentListItem from "./CommentListItem.vue";
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const props = defineProps({
  articleId: {
    type: String,
  },
  articleUserId: {
    type: String,
  },
});

const api = {
  loadComment: "/comment/loadComment",
};

// form信息
const formData=ref({})
const formDataRef=ref({})
const rules={
    content:[{required:true,message:"请输入评论内容"}]
}


//排序
const orderType=ref(0)
const orderChange=(type)=>{
 orderType.value = type;
  loadComment();
}

//评论列表
const loading=ref(null)
const commentListInfo=ref({})
const loadComment=async ()=>{
   let params={
    // pageNo: commentListInfo.value.pageNo,
    articleId: props.articleId,
    orderType: orderType.value,
} 
    loading.value=true
    let result=await proxy.Request({
        url:api.loadComment,
        params:params,
        showLoading:false
    })
    loading.value=false
    if(!result) return
    commentListInfo.value=result.data
}
loadComment()

//隐藏所有回复框
const hiddenAllReplyHandler=()=>{
    commentListInfo.value.list.forEach((element) => {
    element.showReply = false;
  });
}

//评论发布完成
const emit=defineEmits(["updataCommentCount"])
const postCommentFinish=(resultData)=>{
    commentListInfo.value.list.unshift(resultData)
    hiddenAllReplyHandler()
    //更新数量
    const totalCount=commentListInfo.value.totalCount+1
    commentListInfo.value.totalCount=totalCount
    emit("updataCommentCount",totalCount)
}

//当前用户信息
const currentUserInfo=ref({})
watch(
    ()=>store.state.loginUserInfo,
    (newVal,oldVal)=>{
        currentUserInfo.value=newVal||{}
    },
      { immediate: true, deep: true }
)
</script>

<style lang="scss">
.comment-body {
  .comment-title {
    padding-top: 15px;
    padding-left: 20px;
    display: flex;
    align-items: center;
    .title {
      font-size: 20px;
      .count {
        font-size: 14px;
        padding: 0px 10px;
      }
    }
    .tab {
        cursor: pointer;
      .tab-item {
        font-size: 13px;
      }
      .active {
        color: var(--link);
      }
    }
  }
  .comment-form-panel {
    margin-top: 20px;
    .comment-list{
        margin-top: 50px;
    }
  }
}
</style>