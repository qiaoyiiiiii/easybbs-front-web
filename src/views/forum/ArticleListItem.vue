<template>
    <div class="article-item">
        <div class="article-item-inner">
            <div class="article-body">
                <div class="user-info">
                    <Avatar :userId="data.userId" :width="30"></Avatar>
                    <router-link :to="'/user/'+data.userId" class="link-info">{{data.nickName}}</router-link>
                    <el-divider direction="vertical"></el-divider>
                    <div class="post-time">{{data.postTime}}</div>
                    <div class="address">&nbsp;*&nbsp;{{data.userIpAddress}}</div>
                    <el-divider direction="vertical"></el-divider>
                    <router-link :to="`/forum/${data.pBoardId}`" class="link-info">{{data.pBoardName}}</router-link>
                    <template v-if="data.boardName">
                        <span>&nbsp;/&nbsp;</span>
                        <router-link :to="`/forum/${data.pBoardId}/${data.boardId}`" class="link-info">{{data.boardName}}</router-link>
                    </template>
                </div>
        <router-link :to="`/post/${data.articleId}`" class="title">
        <span v-if="data.topType==1" class="top">置顶</span>
         <span v-if="htmlTitle" v-html="data.title"></span>
          <span v-else>{{ data.title }}</span>
        </router-link>
        <div class="summary">{{data.summary}}</div>
        <div class="article-info">
            <span class="iconfont icon-yueduliang">
                {{data.readCount==0?"浏览":data.readCount}}
            </span>
            <span class="iconfont icon-icon">
                {{data.goodCount==0?"点赞":data.readCount}}
            </span>
            <span class="iconfont icon-ico_pinglun
">
                {{data.commentCount==0?"评论":data.readCount}}
            </span>
        </div>
        </div>
        <router-link :to="`/post/${data.articleId}`">
         <Cover :cover="data.cover" :width="100" v-if="data.cover"></Cover>
        </router-link>
            </div>
        </div>
</template>

<script setup>
const props=defineProps({
data:{
type:Object
},
htmlTitle:{
    type:Boolean
}
})
</script>

<style lang="scss">
.article-item{
    padding: 5px 10px 0 10px;
    .article-item-inner{
    border-bottom: 1px solid #ddd;
    padding: 10px 0px;
    display: flex;
        .article-body{
            flex:1;
            .user-info{
                display: flex;
                font-size: 14px; 
                align-items: center;
                color: #4e5969;
                .link-info{
                    margin-left: 5px;
                    text-decoration: none;
                    color: #494949;
                }
                .link-info:hover{
                    color: var(--link);
                }
                .post-time{
                    font-size: 14px;
                    color: #9a9a9a;
                }
            }
            .title{
                font-weight: bold;
                text-decoration: none;
                color: #4e5969;
                margin: 10px 0;
                font-size: 16px;
                display: inline-block;
                .top{
                    font-weight: bold;
                    border: 2px solid var(--pink);
                    font-size: 12px;
                    border-radius: 5px;
                    color: var(--pink);
                    padding: 0px 5px;
                    margin-right: 10px;
                }
            }
            .summary{
                font-size: 14px;
                color: #86909c;
            }
            .article-info{
                margin-top: 10px;
                display: flex;
                align-items: center;
                font-size: 13px;
                .iconfont{
                    color: #86909c;
                    margin-right: 25px;
                    font-size: 14px;
                }
                .iconfont:before{
                    padding-right: 3px;
                }
            }
        }
    }
}
.article-item:hover{
    background: #fafafa;
}
</style>