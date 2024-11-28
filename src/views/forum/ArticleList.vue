  <template>
    <div class="container-body"
    :style="{width:proxy.globalInfo.bodyWidth+'px'}">
    <!-- 二级板块信息 -->
    <div class="sub-board" v-if="pBoardId">
        <span :class="['board-item',boardId==0?'active':'']">
        <router-link :to="`/forum/${pBoardId}`">全部</router-link></span>
        <span v-for="item in subBoardList" :key="item.index" :class="['board-item',item.boardId==boardId?'active':'']">
        <router-link :to="`/forum/${item.pBoardId}/${item.boardId}`">
        {{item.boardName}}</router-link>
        </span>
    </div>
    <div class="article-panel">
        <div class="top-tab">
            <div class="['tab',orderType==0?'active':'']"
            @click="changeOrderType(0)">热榜</div>
            <el-divider direction="vertical"></el-divider>
            <div class="['tab',orderType==1?'active':'']"
            @click="changeOrderType(1)">发布时间</div>
            <el-divider direction="vertical"></el-divider>
            <div class="['tab',orderType==2?'active':'']"
            @click="changeOrderType(2)">最新</div>
        </div>
        <div class="article-list">
            <DataList :dataSource="articleListInfo"
             @loadData="loadArticle"
              :loading="loading"
              noDataMsg="暂无数据">
           <template #default="{data}">
               <ArticleListItem :data="data"></ArticleListItem>
           </template>
           </DataList>
        </div>
    </div>
    </div>
</template>

<script setup>
import ArticleListItem from "./ArticleListItem.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api={
    loadArticle:"/forum/loadArticle",
}
//文章列表
const orderType=ref(0)
const changeOrderType=(type)=>{
    orderType.value=type
    loadArticle()
}

//定义板块信息
//一级板块
const pBoardId=ref(0)
//二级板块
const boardId = ref(0);
const loading = ref(false);
const articleListInfo = ref({});

const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo?articleListInfo.value.pageNo:1,
    orderType: orderType.value,
    boardId:parseInt(boardId.value),
  };
  if(pBoardId.value>=10000) params["pBoardId"]=pBoardId.value;
  let result = await proxy.Request({
    url: api.loadArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};

//二级板块
const subBoardList = ref([]);
const setSubBoard = ()=>{
  subBoardList.value = store.getters.getSubBoardList(pBoardId.value);
};


//监听路由变化
watch(
    ()=>route.params,
    (newVal,oldVal)=>{
        if (
      Object.keys(newVal).length != 0 &&
      !newVal.pBoardId &&
      !newVal.boardId
    ) {
      return;
    }
        pBoardId.value=newVal.pBoardId||0;
        boardId.value=newVal.boardId||0;
        setSubBoard();
        loadArticle();
        store.commit("setActivePBoardId",newVal.pBoardId)
        store.commit("setActiveBoardId",newVal.boardId)
    },
     {immediate:true,deep:true}
)
//监听 板块数据变化
watch (
()=>store.state.boardList,
(newVal,oldVal)=>{
    setSubBoard()
},
{immediate:true,deep:true}
)

</script>

<style lang="scss">
.sub-board{
    padding: 10px 0px 15px 0;
    .board-item{
    background: #fff;
    border-radius: 15px;
    padding: 2px 10px;
    margin-right: 10px;
    color: #909090;
    cursor: pointer;
    font-size: 14px;
    a{
        text-decoration: none;
        color:#909090;
    }
    }
    .active{
        background: var(--link);
        a{
        color: #fff;    
        }
    }
}
.article-panel{
    background: #fff;
    .top-tab{
        display: flex;
        align-items: center;
        padding: 8px;
        font-size: 13px;
        border-bottom: 1px solid #ddd;
        cursor: pointer;
        .tab{
            cursor: pointer;
        }
        .active{
            color: var(--link);
        }
    }
}
</style>