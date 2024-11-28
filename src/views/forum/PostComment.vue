<template>
<div class="post-comment-panel">
    <Avatar :width="50" :userId="userId" style="margin-left:13px"></Avatar>
            <div class="comment-form">   
                <el-form
                :model="formData"
                :rules="rules"
                ref="formDataRef">
                <el-form-item prop="content">
                <el-input
                clearable
                :placeholder="placeholderInfo"
                :maxlength="150"
                resize="none"
                show-word-limit
                v-model="formData.content"
                >
                </el-input>
                <div class="insert-img" v-if="showInsertImg">
                    <div class="pre-img" v-if="commentImg">
                    <CommentImage :src="commentImg"></CommentImage>
                    <span class="iconfont icon-shanchu" @click="removeCommentImg"></span>
                    </div>
                    <el-upload name="file" 
                    :show-file-list="false"
                    accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
                     :multiple="false"
                     :http-request="selectImg">
                        <span class="iconfont icon-shangchuantupian"></span>
                    </el-upload>
                </div>
              </el-form-item>  
              </el-form>
            </div>
            <div class="send-btn" @click="postCommentDo">发表</div>
        </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();

const api = {
  postComment: "/comment/postComment",
};

const props=defineProps({
    articleId:{
        type:String
    },
    pCommentId:{
        type:Number
    },
    replyUserId:{
        type:String
    },
    avatarWidth:{
        type:Number
    },
    userId:{
        type:String
    },
    showInsertImg:{
        type:Boolean
    },
    placeholderInfo:{
        type:String,
        default:"请文明发言共同维护网络环境"
    }
})

//form信息
const checkPostComment=(rule,value,callback)=>{
    if(value==null&&formData.value.image==null){
        callback(new Error(rule.message))
    } else {
        callback()
    }
}

const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [
    { required: true, message: "请输入评论内容",validator:checkPostComment},
    { min: 5, message: "评论至少5个字" },
  ],
};
//发表评论
const emit=defineEmits(["postCommentFinish"])
const postCommentDo=()=>{
formDataRef.value.validate(async (valid)=>{
    if(!valid) return
    let params=Object.assign({},formData.value)
    params.articleId=props.articleId
    params.replyUserId=props.replyUserId
    params.pCommentId=props.pCommentId

      let result=await proxy.Request({
        url:api.postComment,
        params,
      })
      if(!result) return
      proxy.Message.success("评论发布成功")
      formDataRef.value.resetFields()
      removeCommentImg()
      emit("postCommentFinish",result.data)
})
}

//选择照片
const commentImg=ref(null)
const selectImg=(file)=>{
    file=file.file
    let img=new FileReader()
    img.readAsDataURL(file)
    img.onload=({target})=>{
        let imgData=target.result;
        commentImg.value=imgData;
        formData.value.image=file;
    }
}

const removeCommentImg=()=>{
    commentImg.value=null;
    formData.value.image=null;
}
</script>

<style lang="scss">
.post-comment-panel {
  display: flex;
  height: 60px;
  align-items: top;
  .comment-form {
    flex: 1;
    margin: 0px 10px;
    .el-input{
    --el-input-height: 60px;
    }
    .insert-img {
      line-height: normal;
      .iconfont {
        margin-top: 3px;
        font-size: 20px;
        color: #3f3f3f;
      }
      .pre-img {
        width: 60px;
        height: 60px;
        margin-top: 10px;
        position: relative;
        .iconfont {
          cursor: pointer;
          position: absolute;
          top: -10px;
          right: -10px;
          color: rgb(121, 121, 121);
        }
      }
    }
  }
  .send-btn {
    padding: 0;
    cursor: pointer;
    font-size: 17px;
    width: 45px;
    height: 50px;
    background: var(--link);
    color: #fff;
    text-align: center;
    line-height: 50px;
    border-radius: 5px;
    margin-right: 5px;
  }
}
</style>