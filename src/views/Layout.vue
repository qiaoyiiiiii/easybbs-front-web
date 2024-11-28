<template>
    <div>
        <div class="header" v-if="showHeader">
            <div class="header-content"
             :style="{width:proxy.globalInfo.bodyWidth+'px'}">
             <!-- logo -->
             <router-link to="/" class="logo">
                <span v-for="item in logoInfo" :style="{color:item.color}" :key="item.index" >{{item.letter}}</span>
             </router-link>

             <!-- 模块信息 -->
             <div class="menu-panel">
                <router-link to="/" :class="['menu-item home',activePBoardId == undefined?'active':'']">首页</router-link>
                <template v-for="board in boardList">
                <el-popover
                :key="board.index"
                placement="bottom-start"
                title="Title"
                :width="300"
                trigger="hover"
                v-if="board.children.length>0"
            >
                <template #reference>
                    <span :class="['menu-item',board.boardId==activePBoardId?'active':'']" @click="boardClickHandler(board)">{{board.boardName}}</span>
                </template>
                <div class="sub-board-list">
                     <span v-for="subBoard in board.children" :class="['sub-board',subBoard.boardId==activeBoardId?'active':'']"  
                     :key="subBoard.index" @click="subBoardClickHandler(subBoard)"
                     >{{subBoard.boardName}}</span>
                </div>
            </el-popover>
             <span 
             :key="board.index"
             :class="['menu-item',board.boardId==activePBoardId?'active':'']" 
             v-else 
             @click="boardClickHandler(board)">{{board.boardName}}</span>
            </template>
             </div>

             <!-- 用户登录注册 -->
             <div class="user-info-panel">
                <div class="op-btn">
                <el-button type="primary" @click="newPost">
                    发帖 <span class="iconfont icon-fatie2"></span>
                </el-button>
                <el-button type="primary" @click="goSearch">
                    搜索 <span class="iconfont icon-sousuo"></span>
                </el-button>
                </div>

                <!-- 个人中心 -->
                <template v-if="userInfo.userId">
                <div class="message-info">
                <el-dropdown>
                <div class="iconfont icon-qunfengxiaoxitishilingdang"></div>   
                <el-badge :value="messageCountInfo.total" :max="99" class="item" v-if="messageCountInfo.total>0">   
                </el-badge>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="gotoMessage('reply')" class="message-item">
                    <span class="text">回复我的</span>
                    <span class="count-item"  v-if="messageCountInfo.reply>0">
                        {{messageCountInfo.reply>99?99:messageCountInfo.reply}}</span></el-dropdown-item>
                    <el-dropdown-item  @click="gotoMessage('likePost')"  class="message-item">
                        <span class="text">点赞我的文章</span>
                        <span class="count-item"  v-if="messageCountInfo.likePost>0">
                            {{messageCountInfo.likePost>99?99:messageCountInfo.likePost}}</span>
                        </el-dropdown-item>
                    <el-dropdown-item  @click="gotoMessage('downloadAttachment')" class="message-item">
                    <span class="text">下载了我的附件</span> 
                    <span class="count-item"  v-if="messageCountInfo.downloadAttachment>0">
                        {{messageCountInfo.downloadAttachment>99?99:messageCountInfo.downloadAttachment}}
                        </span></el-dropdown-item>
                    <el-dropdown-item  @click="gotoMessage('likeComment')"  class="message-item">
                        <span class="text">点赞我的评论</span>
                    <span class="count-item" v-if="messageCountInfo.likeComment>0">
                        {{messageCountInfo.likeComment>99?99:messageCountInfo.likeComment}}</span>
                    </el-dropdown-item>
                    <el-dropdown-item  @click="gotoMessage('sys')"  class="message-item">
                        <span class="text">系统消息</span>
                    <span class="count-item" v-if="messageCountInfo.sys>0">
                        {{messageCountInfo.sys>99?99:messageCountInfo.sys}}</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
            </div>
            <div class="user-info">
            <el-dropdown>
                   <Avatar :width="50" :userId="userInfo.userId" :addLink="false"></Avatar>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="goToUcenter">我的主页</el-dropdown-item>
                    <el-dropdown-item @click="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
              </div>  
                </template>
                <!-- 登录框 -->
                
                <el-button-group :style="{'margin-left':'10px'}" v-else>
                <el-button type="primary" plain @click="loginAndRegister(1)">
                    登录
                </el-button>
                <el-button type="primary" plain @click="loginAndRegister(0)">
                    注册
                </el-button>    
                </el-button-group>
            </div>
             </div>
        </div>
        <div class="body-content">
            <router-view />
        </div>
        <div>
         </div>    
            <!-- 登录 注册 -->
            <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>  
            <!-- 回到顶部 -->
            <el-backtop :right="100" :bottom="200"></el-backtop>
    </div>
</template>

<script setup>
import LoginAndRegister from "./LoginAndRegister.vue"
import {ref,reactive, getCurrentInstance, onMounted,watch} from "vue"
import {useRouter} from "vue-router";
import {useStore} from "vuex"
const {proxy} =getCurrentInstance(); //全局this
const router=useRouter();
const store=useStore()

const api={
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
  loadMessageCount: "/ucenter/getMessageCount",
  logout: "/logout",
  getSysSetting: "/getSysSetting",
}

const logoInfo=ref([
    {
        letter:'E',
        color:"#3285FF"
    },{
        letter:'a',
        color:"#FB3624"
    },{
        letter:'s',
        color:"#FFBA02"
    },{
        letter:'y',
        color:"#3285FF"
    },{
        letter:'b',
        color:"#25B04E"
    },{
        letter:'b',
        color:"#FD3224"
    },{
        letter:'s',
        color:"#FFBA02"
    },
]);

//活动条
const showHeader=ref(true);
const getScrollTop=()=>{
    let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
    return scrollTop;
};
const initScroll=()=>{
    let initScrollTop=getScrollTop() //初始滑动条被遮盖
    let scrollType=0
    window.addEventListener("scroll",()=>{
        let currentScrollTop=getScrollTop() //滑动时滑动条遮盖大小
        if(currentScrollTop>initScrollTop) scrollType=1 //往下滑
        else scrollType=0  //往上滑
        initScrollTop=currentScrollTop
        if(scrollType==1&&currentScrollTop>100) showHeader.value=false;
        else showHeader.value=true
    })
}

//获取用户信息
const getUserInfo=async ()=>{
let result=await proxy.Request({
    url:api.getUserInfo
});
if(!result) {return}
store.commit("updateLoginUserInfo",result.data)
}

// 登录注册
const loginRegisterRef=ref()
const loginAndRegister=(type)=>{
loginRegisterRef.value.showPanel(type);
}
 
 //监听 登录用户信息
 const userInfo=ref({})
 watch(
()=>store.state.loginUserInfo,
 (newVal,oldVal)=>{
    if(newVal!=undefined&&newVal!=null){
    userInfo.value=newVal
    loadMessageCount()
    }else{
    userInfo.value={}
 }
  if(newVal){
        loadMessageCount()
    }
 },
 {immediate:true,deep:true})
 
//获取板块信息
const boardList=ref([])
const loadBoard=async ()=>{
    let result=await proxy.Request({
        url:api.loadBoard,
    })
    if(!result) {return}
    boardList.value=result.data
    store.commit("saveBoardList",result.data)
}
loadBoard()


 //监听是否弹出登录弹框
 watch(
    ()=>store.state.showLogin,
    (newVal,oldVal)=>{
        if(newVal){
            loginAndRegister(1);
        }
    },
    {immediate:true,deep:true}
)

//板块点击
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
};
//二级板块
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
};

//当前选中的板块
const activePBoardId=ref(0)
watch(
    ()=>store.state.activePBoardId,
    (newVal,oldVal)=>{
        if(newVal!=0)
        {activePBoardId.value=newVal}
    
    },
    {immediate:true,deep:true}
)
const activeBoardId=ref(0)
watch(
    ()=>store.state.activeBoardId,
    (newVal,oldVal)=>{
        activeBoardId.value=newVal||{}
    },
    {immediate:true,deep:true}
)

onMounted(()=>{
    initScroll();
    getUserInfo();
    // loadSysSetting()
})
//发帖
const newPost=()=>{
    if (!store.getters.getLoginUserInfo) {
    loginAndRegister(1);
  } else {
    router.push("/newPost");
  }
}

//消息相关
const gotoMessage=(type)=>{
router.push(`/user/message/${type}`)
}
const messageCountInfo=ref({})
const loadMessageCount=async()=>{
    let result = await proxy.Request({
       url:api.loadMessageCount
    })
    if(!result){
      return;
    }
    messageCountInfo.value=result.data
    store.commit("updataMessageCountInfo",result.data)
}
watch(
 () =>store.state.messageCountInfo,
 (newVal, oldVal) => {
    messageCountInfo.value=newVal
 }, 
 { immediate: true, deep: true }
 );

//去主页
const goToUcenter=()=>{
        router.push("/user/"+store.getters.getLoginUserInfo.userId);
}
//退出
const logout=()=>{
    proxy.Confirm("确定要退出吗？",async()=>{
   let result = await proxy.Request({
      url:api.logout,
   })
   if(!result){
     return;
   }
   store.commit("updateLoginUserInfo",null)
    })
}

//获取系统配置
const loadSysSetting=async()=>{
let result = await proxy.Request({
   url:api.getSysSetting,
})
if(!result){
  return;
}
store.commit("saveSysSetting",result.data)
}

//搜索
const goSearch=()=>{
    router.push("/search")
}
</script>


<style lang="scss" scoped>
.header {
  top: 0px;
  width: 100%;
  position: fixed;
  box-shadow: 0 2px 6px 0 #ddd;
  z-index: 1000;
  background: #fff;
  .header-content {
    margin: 0px auto;
    align-items: center;
    height: 60px;
    display: flex;
    align-items: center;
    .logo {
      display: block;
      text-decoration: none;
      margin-right: 5px;
      span {
        font-size: 35px;
      }
    }
    .menu-panel {
      flex: 1;
      .menu-item {
        margin-left: 20px;
        cursor: pointer;
      }
      .home {
        text-decoration: none;
        color: #000;
      }
      .active {
        color: var(--link);
      }
    }
    .user-info-panel {
      width: 300px;
      display: flex;
      align-items: center;
      .op-btn {
        .iconfont {
          margin-left: 5px;
        }
        .el-button + .el-button {
          margin-left: 5px;
        }
      }
      .message-info {
        margin-left: 5px;
        margin-right: 25px;
        cursor: pointer;
        .iconfont {
          text-decoration: none;
          font-size: 26px;
          color: rgb(147, 147, 147);
        }
      }
    }
  }
}
   .el-button-group {
            display: flex;
            vertical-align: middle;
        }

.body-content{
    margin-top: 60px;
    position: relative;
}

.sub-board-list{
    display: flex;
    flex-wrap: wrap;
    .sub-board{
        padding: 0px 10px;
        color: rgb(119,118,118);
        border-radius: 20px;
        background: rgb(239, 239, 239);
        margin-top: 10px;
        margin-right: 10px;
        border: 1px solid #ddd;
        cursor: pointer;
    }
    .sub-board:hover{
        color: var(--link);
    }
    .active{
        background: var(--link);
        color: #fff;
    }
    .active:hover{
        color: #fff;
    }
}
.message-item{
    display: flex;
    justify-content: space-between;
    .text{
        flex: 1;
    }
    .count-item{
        line-height: 15px;
        width: 20px;
        height: 15px;
        display: block;
        background: #f56c6c;
        border-radius: 8px;
        font-size: 10px;
        font-weight: bold;
        text-align: center;
        color: #fff;
        margin-left: 9px;
    }
}
</style>