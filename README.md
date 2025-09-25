# EasyBBS 前端项目

## 项目简介
EasyBBS 是一个基于 Vue 3 和 Element Plus 的社区论坛前端项目，支持文章发布、评论、点赞、用户中心管理、消息通知等功能。项目采用模块化设计，界面简洁，交互流畅，适合搭建轻量级的社区论坛系统。

## 技术栈
- Vue 3（组合式 API）
- Vue Router（路由管理）
- Vuex（状态管理）
- Element Plus（UI 组件库）
- highlight.js（代码高亮）
- @kangc/v-md-editor（Markdown 编辑器）
- js-md5（密码加密）
- Axios（封装为 proxy.Request，用于接口请求）

## 主要功能模块

### 1. 文章模块
- 文章列表（支持按板块、排序方式筛选）
- 文章详情（支持内容展示、附件下载、评论、点赞、目录生成、代码高亮、图片预览）
- 文章发布与编辑（Markdown 编辑器支持图片上传）

### 2. 用户模块
- 用户登录、注册、密码重置（支持邮箱验证码验证）
- 用户个人中心（展示用户信息、积分、获赞数、发帖数等）
- 用户积分记录查看
- 用户信息编辑（昵称、头像、简介）

### 3. 消息通知
- 回复我的评论
- 点赞我的评论
- 赞了我的文章
- 下载了我的附件

### 4. 论坛板块导航
- 一级板块和二级板块浏览
- 板块跳转功能

### 5. 其他功能
- 搜索功能
- 系统配置加载
- 登录状态管理及退出功能

## 目录结构（部分）

 ```

src/
├── components/
│   └── EditorMarkdown.vue       # Markdown 编辑器组件
├── router/
│   └── index.js                 # 路由配置
├── store/                      # Vuex 状态管理
├── utils/
│   └── Verify.js               # 表单验证工具
├── views/
│   ├── forum/
│   │   ├── ArticleList.vue     # 文章列表页
│   │   ├── ArticleDetail.vue   # 文章详情页
│   │   ├── EditPost.vue        # 文章编辑页
│   │   └── ArticleListItem.vue # 文章列表项组件
│   ├── ucenter/
│   │   ├── Ucenter.vue         # 用户中心主页
│   │   ├── UcenterEditUserInfo.vue # 用户信息编辑弹窗
│   │   ├── UserIntegralRecord.vue  # 用户积分记录弹窗
│   │   └── MessageList.vue     # 用户消息列表
│   ├── LoginAndRegister.vue    # 登录注册页
│   ├── Layout.vue              # 主布局页
│   └── Search.vue              # 搜索页
└── App.vue                    # 根组件
```
### 代码说明
- Markdown 编辑器 使用 @kangc/v-md-editor ，支持 GitHub 主题和代码高亮，支持图片上传功能，上传接口为 file/uploadImage 。
- 登录注册 通过邮箱验证码验证，密码使用正则表达式校验（必须包含大小写字母和数字，长度8-20），密码传输时使用 md5 加密。
- 文章详情 支持附件下载，下载前会提示积分扣除，支持图片点击预览和代码块高亮显示，自动生成文章目录。
- 用户中心 展示用户基本信息和统计数据，支持查看积分记录和编辑个人资料。
- 消息列表 展示不同类型的消息（评论回复、点赞、文章点赞、附件下载等），支持跳转到相关内容。
- 路由配置 采用 Vue Router，支持多级路由和动态路由，包含首页、板块页、文章详情页、用户中心、消息页、搜索页等。
## 代码规范
- 使用 Vue 3 组合式 API
- 组件采用 <script setup> 语法糖
- 样式使用 SCSS，部分组件使用 scoped 样式
- 接口请求统一封装为 proxy.Request
- 表单验证统一使用 utils/Verify.js 中的正则规则和验证方法
