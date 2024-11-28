<template>
    <div class="comment-item">
        <Avatar
        :userId="commentData.userId"
        :width="50" style="margin-left:33px"></Avatar>
        <div class="comment-info">
            <div class="nick-name">
             <span class="name" @click="gotoUcenter(commentData.userId)"> {{commentData.nickName}}</span>  
             <span v-if="commentData.userId==articleUserId"
             class="tag-author">作者</span>
            </div>
             <div class="comment-content" >
             <div>
          <span class="tag tag-topping" v-if="commentData.topType == 1">置顶</span>
          <span class="tag no-audit" v-if="commentData.status == 0">待审核</span>
          <span v-html="commentData.content"></span>
        </div>
                <CommentImage v-if="commentData.imgPath" 
                :style="{ 'margin-top': '10px' }"
                :src="proxy.globalInfo.imageUrl+commentData.imgPath.replace('.','_.')"
                :imgList="[proxy.globalInfo.imageUrl+commentData.imgPath]"></CommentImage>
            </div>
            <div class="op-panel">
                <div class="time">
                    <span>{{commentData.postTime}}</span>
                    <span class="address">
                        &nbsp;&nbsp;{{commentData.userIpAddress}}
                    </span>
                </div>
                 <span :class="['iconfont icon-icon',commentData.likeType==1?'active':'']" @click="doLike(sub)">
                    {{commentData.goodCount>0?commentData.goodCount:"点赞"}}</span>
                 <span class="iconfont icon-ico_pinglun" @click="showReplyPanel(commentData)">回复</span>
                 <el-dropdown v-if="articleUserId==currentUserId">
                    <span class="iconfont icon-gengduosangedian"></span>
                    <template #dropdown>
                        <el-dropdown-menu @click="opTop(commentData)">
                            <el-dropdown-item>
                                {{commentData.topType==0?"设为置顶":"取消置顶"}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                 </el-dropdown>
            </div>
            <div class="comment-sub-list" v-if="commentData.children">
              <div class="comment-sub-item" v-for="sub in commentData.children" :key="sub.index">
                <Avatar :userId="commentData.userId" :width="30"></Avatar>
                <div class="comment-sub-info">
                  <div class="nick-name">
                    <span class="name" @click="gotoUcenter(commentData.userId)">{{sub.nickName}}</span>
                    <span class="tag-author"
                    v-if="sub.userId==articleUserId">作者</span>
                    <span class="reply-name">回复</span>
                    <span @click="gotoUcenter(sub.replyUserId)" class="a-link">@{{sub.replyNickName}}</span>
                    <span>：</span>
                    <span v-html="sub.content" class="sub-content"></span>
                  </div>
                   <div class="op-panel">
                <div class="time">
                    <span>{{commentData.postTime}}</span>
                    <span class="address">
                        &nbsp;&nbsp;{{commentData.userIpAddress}}
                    </span>
                </div>
                 <span :class="['iconfont icon-icon',sub.likeType==1?'active':'']" @click="doLike(sub)">
                    {{sub.goodCount > 0?sub.goodCount:"点赞"}}</span>
                      <span class="iconfont icon-ico_pinglun" @click="showReplyPanel(sub,1)">回复</span>
                    </div>
                </div>
              </div>
            </div>
            <div class="reply-info" v-if="commentData.showReply">
              <PostComment
              :placeholderInfo="placeholderInfo"
              :articleId="articleId"
              :avatarWidth="30"
              :userId="currentUserId"
              :showInsertImg="false"
              :pCommentId="pCommentId"
              :replyUserId="replyUserId"
              @postCommentFinish="postCommentFinish"></PostComment>
            </div>
        </div>
    </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import PostComment from "./PostComment.vue";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();

const api = {
  doLike: "/comment/doLike",
  changeTopType: "/comment/changeTopType",
};

const props=defineProps({
    articleId:{
      type:String
    },
    commentData:{
        type:Object
    },
    articleUserId:{
        type:String
    },
    currentUserId:{
        type:String
    }
})

//显示评论框
const pCommentId=ref(0)
const replyUserId=ref(null)
const placeholderInfo=ref(null)
const emit=defineEmits(["hiddenAllReply","reloadData"])

const showReplyPanel=(curDate,type)=>{
const haveShow=props.commentData.showReply==undefined?false:props.commentData.showReply
emit("hiddenAllReply")
if(type==0){
  props.commentData.showReply=!haveShow
} else{
  props.commentData.showReply=true
}
curDate.showReply=!haveShow
pCommentId.value=props.commentData.commentId;
replyUserId.value=curDate.userId
placeholderInfo.value="回复@"+curDate.nickName
}

//插入二级评论
const postCommentFinish=(resultData)=>{
 props.commentData.children=resultData
}

const gotoUcenter=(userId)=>{
  router.push(`/user/${userId}`)
}

const doLike=async (data)=>{
let result = await proxy.Request({
     url:api.doLike,
     showloading:false,
     params:{
      commentId:data.commentId
     }
  })
  if(!result){
    return;
  }
  data.goodCount=result.data.goodCount
  data.likeType=result.data.likeType
}

//置顶
const opTop=async (data)=>{
let result = await proxy.Request({
   url:api.changeTopType,
   params:{
    commentId:data.commentId,
    topType:data.topType==1?0:1
   }
})
if(!result){
  return;
}
emit("reloadData")
}
</script>

<style lang="scss">
.comment-item {
  display: flex;
  padding-top: 15px;
  .comment-info {
    flex: 1;
    margin-left: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;
    .nick-name {
      .name {
        font-size: 14px;
        color: var(--text2);
        margin-right: 10px;
        cursor: pointer;
      }
      .tag-author {
        background: var(--pink);
        color: #fff;
        font-size: 12px;
        border-radius: 2px;
        padding: 0px 3px;
      }
    }
    .comment-content {
      margin-top: 5px;
      font-size: 15px;
      line-height: 22px;
      .tag {
        margin-right: 5px;
        font-size: 12px;
        border-radius: 3px;
        padding: 0px 5px;
      }
      .tag-topping {
        color: var(--pink);
        border: 1px solid var(--pink);
      }
      .no-audit {
        color: var(--text2);
        border: 1px solid var(--text2);
      }
    }
    .op-panel {
      display: flex;
      align-items: center;
      margin-top: 5px;
      font-size: 13px;
      color: var(--text2);
      .time {
        margin-right: 20px;
      }
      .iconfont {
        margin-right: 15px;
        font-size: 14px;
        color: var(--icon);
        cursor: pointer;
      }
      .iconfont::before {
        margin-right: 3px;
      }
      .active {
        color: var(--link);
      }
    }
    .comment-sub-list {
      margin-top: 10px;
      .comment-sub-item {
        display: flex;
        margin: 8px 0px;
        font-size: 14px;
        .comment-sub-info {
          margin-left: 5px;
          .nick-name {
            .reply-name {
              margin: 0px 5px;
            }
            .sub-content {
              font-size: 15px;
            }
          }
        }
      }
    }
    .reply-info {
      margin-top: 15px;
    }
  }
}
</style>