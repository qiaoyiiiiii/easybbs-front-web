<template>
     <div
    class="container-body ucenter"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
    <div class="user-banner">
        <router-link to="/" class="a-link">首页</router-link>
        <span> > 个人中心</span>
    </div>
    <div class="ucenter-panel">
        <div class="user-side">
            <!-- 头像 -->
            <div class="avatar-panel">
                <div class="edit-btn a-link" v-if="isCurrentUser"
                @click="updataUserInfo">修改资料</div>
                <div class="avatar-inner">
                <Avatar :userId="userInfo.userId" :width="120"></Avatar>
                </div>
                <div class="nick-name">
                    <span>{{userInfo.nickName}}</span>
                </div>
                <div class="desc">
                    {{userInfo.personDescription}}
                </div>
            </div>
        <!-- 拓展信息 -->
        <div class="user-extend-panel">
            <div class="info-item">
            <div class="label iconfont">积分</div>
            <div class="value a-link" v-if="isCurrentUser" @click="showRecordHandler">
                {{userInfo.currentIntegral}}
            </div>                   
            </div>
             <div class="info-item">
            <div class="label iconfont ">获赞</div>
            <div class="value">
                {{userInfo.likeCount}}
            </div>                   
            </div>
             <div class="info-item">
            <div class="label iconfont ">发帖</div>
            <div class="value">
                {{userInfo.postCount}}
            </div>                   
            </div>
             <div class="info-item">
            <div class="label iconfont ">加入</div>
            <div class="value">
                {{userInfo.joinTime}}
            </div>                   
            </div>
             <div class="info-item">
            <div class="label iconfont ">最近登录</div>
            <div class="value">
                {{userInfo.lastLoginTime}}
            </div>                   
            </div>
        </div>
         </div>
        <div class="article-panel">
            <el-tabs 
            :model-value="activeTabname"
            @tab-change="changeTab">
            <el-tab-pane label="发帖" :name="0"></el-tab-pane>
            <el-tab-pane label="评论" :name="1"></el-tab-pane>
            <el-tab-pane label="点赞" :name="2"></el-tab-pane>
            </el-tabs>
            <div class="article-list">
            <DataList :dataSource="articleListInfo"
            @loadData="loadArticle"
            :loading="loading"
            noDataMsg="暂无相关文章">
           <template #default="{data}">
               <ArticleListItem :data="data"></ArticleListItem>
           </template>
           </DataList>
        </div>
        </div>
    </div>
    <UcenterEditUserInfo
    ref="ucenterEditUserInfoRef"
    @resetUserInfo="resetUserInfoHandler"></UcenterEditUserInfo>
     <!--用户积分记录-->
    <UserIntegralRecord ref="ucenterIntegralRecordRef"></UserIntegralRecord>
    </div>
</template>

<script setup>
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import UcenterEditUserInfo from "./UcenterEditUserInfo.vue";
import UserIntegralRecord from "./UserIntegralRecord.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
  getUserInfo: "/ucenter/getUserInfo",
  loadUserArticle: "/ucenter/loadUserArticle",
};

const userId=ref()
const userInfo=ref({})
const loadUserInfo=async()=>{
let result = await proxy.Request({
   url:api.getUserInfo,
   params:{
    userId:userId.value
   },
   errorCallback:()=>{
    setTimeout(()=>{
        router.push("/")
    },1500)
   }
})
if(!result){
  return;
}
userInfo.value=result.data
}

const isCurrentUser = ref(false);
//重新设置当前用户
const resetCurrentUser = () => {
  const loginUserInfo = store.getters.getLoginUserInfo;
  if (loginUserInfo && loginUserInfo.userId === userId.value) {
    isCurrentUser.value = true;
  } else {
    isCurrentUser.value = false;
  }
};

//右侧的文章
const activeTabname=ref(0)
const changeTab=(type)=>{
activeTabname.value=type
loadArticle()
}

const loading = ref(false);
const articleListInfo = ref({});

const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo?articleListInfo.value.pageNo:1,
    type:activeTabname.value,
    userId:userId.value
  };
  let result = await proxy.Request({
    url: api.loadUserArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};

watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    resetCurrentUser();
  },
  { immediate: true, deep: true }
);

watch(
  () => route.params.userId,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal;
      resetCurrentUser();
      loadUserInfo();
      loadArticle();
    }
  },
  { immediate: true, deep: true }
);
//修改用户信息
const ucenterEditUserInfoRef=ref()
const updataUserInfo=()=>{
ucenterEditUserInfoRef.value.showEditUserInfoDialog(userInfo.value)
}

const resetUserInfoHandler=(data)=>{
userInfo.value=data
}

//获得用户积分记录
const ucenterIntegralRecordRef=ref(null)
const showRecordHandler=()=>{
ucenterIntegralRecordRef.value.showRecord()
}
</script>

<style lang="scss">
.ucenter{
    line-height: 30px;
    .user-banner{
        font-size: 16px;
        line-height: 35px;
    }

    .ucenter-panel{
        display: flex;
        .user-side{
        width: 300px;
        margin-right: 10px;
        .avatar-panel{
            background: #fff;
            text-align: center;
            padding: 10px;
            .edit-btn{
                text-align: right;
                font-size: 14px;
            }
            .avatar-inner{
              justify-content: center;
              display: flex;
            }
            .desc{
                margin-top: 5px;
                text-align: center;
                font-size: 12px;
                color: #929292;
            }
        }
        .user-extend-panel {
        margin-top: 10px;
        background: #fff;
        padding: 10px;
        .info-item {
          display: flex;
          justify-content: space-between;
          line-height: 30px;
          .label {
            font-size: 13px;
          }
          .label::before {
            font-size: 22px;
            color: #888888;
            padding-right: 5px;
          }
          .value {
            font-size: 13px;
          }
        }
      }
    } 
    .article-panel{
        flex: 1;
        background: #fff;
        padding: 0 10px 10px 10px;
    }
}
}
</style>