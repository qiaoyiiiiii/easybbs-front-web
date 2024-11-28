<template>
    <div>
    <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="400"
    :showCancel="false"
    @close="closeDialog">
    <el-form
    :model="formData"
    :rules="rules"
    ref="formDataRef"
    class="login-register">
    <!-- input输入 -->
    <el-form-item prop="email">
        <el-input
        size="large"
        clearable
        placeholder="请输入邮箱"
        maxlength="150"
        v-model="formData.email">
        <template #prefix>
            <span class="iconfont icon-youxiang"></span>
        </template>
    </el-input>
    </el-form-item>
    <!-- 登录密码 -->
    <el-form-item v-if="opType==1" prop="password">
        <el-input
        show-password
        size="large"
        clearable
        placeholder="请输入密码"
        v-model="formData.password">
        <template #prefix>
            <span class="iconfont icon-mima"></span>
        </template>
    </el-input>
    </el-form-item>
    <!-- 注册 -->
    <div v-if="opType==0||opType==2">
    <el-form-item prop="emailCode" class="ww">
        <div class="send-email-panel">
        <el-input
        size="large"
        clearable
        placeholder="请输入邮箱验证码"
        v-model="formData.emailCode">
        <template #prefix>
            <span class="iconfont icon-yanzhengyanzhengma"></span>
        </template>
    </el-input>
    <el-button class="send-mail-btn" type="primary" size="large" @click="getEmailCode">获取验证码</el-button>
    </div>
  <el-tooltip placement="top" class="notice_panel">
    <template #content> 1.在垃圾箱中查找邮箱验证码<br />2.在邮箱中头像->设置->反垃圾->白名单->设置邮箱地址白名单 </template>
    <a href="javascript:;" class="notice">未收到邮箱验证码</a>
  </el-tooltip>
    </el-form-item>
    <el-form-item prop="nickName" v-if="opType==0">
        <el-input
        size="large"
        clearable
        placeholder="请输入昵称"
        maxlength="20"
        v-model="formData.nickName">
        <template #prefix>
            <span class="iconfont icon-xingmingyonghumingnicheng"></span>
        </template>
    </el-input>
    </el-form-item>
    <el-form-item prop="registerPassword">
        <el-input
        show-password
        size="large"
        clearable
        placeholder="请设置密码"
        v-model="formData.registerPassword">
        <template #prefix>
            <span class="iconfont icon-mima"></span>
        </template>
    </el-input>
    </el-form-item>
    <el-form-item prop="reRegisterPassword">
        <el-input
        show-password
        size="large"
        clearable
        placeholder="请再输入密码"
        v-model="formData.reRegisterPassword">
        <template #prefix>
            <span class="iconfont icon-mima"></span>
        </template>
    </el-input>
    </el-form-item>
    </div>
    <el-form-item prop="checkCode">
        <div class="check-code-panel">
        <el-input
        size="large"
        clearable
        placeholder="请输入验证码"
        v-model="formData.checkCode">
        <template #prefix>
            <span class="iconfont icon-yanzhengyanzhengma"></span>
        </template>
    </el-input>
    <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode(0)">
</div>
    </el-form-item>
    <el-form-item v-if="opType==1">
        <div class="remember-panel">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
            </div>
            <div class="no-account">
                <a href="javascript:;" @click="showPanel(0)">没有账号？</a>
                <a href="javascript:;" @click="showPanel(2)">忘记密码？</a>
            </div>
    </el-form-item>
    <el-form-item v-if="opType==0">
        <a href="javascript:;" @click="showPanel(1)">已有帐号</a>
    </el-form-item>
    <el-form-item v-if="opType==2">
        <a href="javascript:;" @click="showPanel(1)">去登陆？</a>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" class="op-btn" @click="doSubmit">
            <span v-if="opType==0">注册</span>
            <span v-if="opType==1">登录</span>
            <span v-if="opType==2">重置密码</span>
        </el-button>
    </el-form-item>
    </el-form>
    </Dialog>
    <!-- 发送邮箱验证码 -->
    <Dialog
    :show="dialogConfig4SendMailCode.show"
    :title="dialogConfig4SendMailCode.title"
    :buttons="dialogConfig4SendMailCode.buttons"
    width="500px"
    :showCancel="false"
    @close="dialogConfig4SendMailCode.show=false">
    <el-form
    :model="formData4SendMailCode"
    :rules="rules"
    ref="formData4SendMailCodeRef"
    label-width="80px">
    <el-form-item label="邮箱">
    {{formData.email}}
    </el-form-item>
        <el-form-item prop="checkCode" label="验证码">
        <div class="check-code-panel">
        <el-input
        size="large"
        placeholder="请输入验证码"
        v-model="formData4SendMailCode.checkCode">
        <template #prefix>
            <span class="iconfont icon-yanzhengyanzhengma"></span>
        </template>
    </el-input>
    <img :src="checkCodeUrl4SendMailCode" class="check-code" @click="changeCheckCode(1)">
</div>
    </el-form-item>
    </el-form>
    </Dialog>
</div>
</template>

<script setup>
import {ref,reactive, getCurrentInstance, onMounted, nextTick} from "vue"
import md5 from "js-md5"
import {useRouter,useRoute} from "vue-router";
import {useStore} from "vuex"
const {proxy} =getCurrentInstance(); //全局this
const router=useRouter();
const route=useRoute();
const store=useStore()

const api={
    checkCode:"/api/checkCode",
    sendMailCode:"/sendEmailCode",
    register:"/register",
    login:"/login",
    resetPwd:"/resetPwd",
    getUserInfo:"/getUserInfo"
};

//0:注册  1：登录 2：找回密码
const opType=ref();
const showPanel =(type)=>{
opType.value=type;
resetForm();
}
defineExpose({showPanel})

//验证码
const checkCodeUrl=ref(api.checkCode)
const checkCodeUrl4SendMailCode=ref(api.checkCode)
const changeCheckCode=(type)=>{
    if(type==0){
        checkCodeUrl.value=api.checkCode+"?type="+type+"&time="+new Date().getTime();
    }
else checkCodeUrl4SendMailCode.value=api.checkCode+"?type="+type+"&time="+new Date().getTime();
}

//发送邮箱验证码弹窗
const formData4SendMailCode=ref({})
const formData4SendMailCodeRef=ref()
const dialogConfig4SendMailCode=reactive({
    show:false,
    title:"发送邮箱验证码",
    buttons:[{type:"primary",
        text:"发送验证码",
        click:()=>{
            sendEmailCode();
        }
    }]
});
//获取邮箱验证码
const getEmailCode=()=>{
    formDataRef.value.validateField("email",(valid)=>{
        if(!valid) {return;}
    dialogConfig4SendMailCode.show=true;

    nextTick(()=>{//dom更新后自动调用
        changeCheckCode(1);
        formData4SendMailCodeRef.value.resetFields();
        formData4SendMailCode.value={
            email:formData.value.email,
        };
    })
})
}
//发送邮箱
const sendEmailCode=()=>{
    formData4SendMailCodeRef.value.validate(async (valid)=>{
        if(!valid) {return;}
        const params=Object.assign({},formData4SendMailCode.value);
        params.type=opType.value==0?0:1;
        let result=await proxy.Request({
            url:api.sendMailCode,
            params:params,
            errorCallback:()=>{
                changeCheckCode(1);
            }
        });
        if(!result){
            return;
        }
        proxy.Message.success("验证码发送成功，请登录邮箱查看");
        dialogConfig4SendMailCode.show=false;
    })
}

//登陆注册弹出配置
const dialogConfig=reactive({
    show:false,
    title:"登录",
});


const formData=ref({})
const formDataRef=ref()
//校验输入格式
const checkRePassword=(rule,value,callback)=>{
if(value!==formData.value.registerPassword){
    callback(new Error(rule.message))
}
else callback()
}

const rules={
    email:[{required:true,message:"请输入邮箱"},
        {max:150,message:"邮箱太长"},
        {validator:proxy.Verify.email,message:"请输入正确的邮箱"},
    ],
    password:[{required:true,message:"请输入密码"}],
    emailCode:[{required:true,message:"请输入邮箱验证码"}],
    nickName:[{required:true,message:"请输入昵称"}],
    registerPassword:[{required:true,message:"请设置密码"},
        {validator:proxy.Verify.password,message:"包含大小写字母和数字的组合不能使用特殊字符长度在 8-20 之间"},
    ],
    reRegisterPassword:[{required:true,message:"请再次输入密码"},
        {validator:checkRePassword,message:"两次输入的密码不一致"},],
    checkCode:[{required:true,message:"请输入图片验证码"}],
}

//重置表单
const resetForm=()=>{
dialogConfig.show=true;
if(opType.value==0){
    dialogConfig.title="注册";
}else if(opType.value==1){
    dialogConfig.title="登录";
}else if(opType.value==2){
    dialogConfig.title="重置密码";
}
nextTick(()=>{
    changeCheckCode(0);
    formDataRef.value.resetFields();
   formData.value={}

   if(opType.value==1){
    // 记住我
    const cookieLoginInfo=proxy.VueCookies.get("loginInfo");
    if(cookieLoginInfo){
        formData.value=cookieLoginInfo;
    }
   }
    })
}

//登录、注册、重置密码 提交表单
const doSubmit =()=>{
    formDataRef.value.validate(async (valid)=>{
        if(!valid){
            return
        }
        let params={};
        Object.assign(params,formData.value)

        //注册
        if(opType.value==0||opType==2){
            params.password=params.registerPassword;
            delete params.reRegisterPassword
            delete params.registerPassword
        }
       
        //登录
        if(opType.value==1){
            let cookieLoginInfo=proxy.VueCookies.get("loginInfo");
            let cookiePassword=cookieLoginInfo==null?null:cookieLoginInfo.password;
            if(params.password!==cookiePassword){
                params.password=md5(params.password);
            }
        }
         let url=null;
        if(opType.value==0){
            url=api.register
        }else if(opType.value==1){
            url=api.login
        }else if(opType.value==2){
            url=api.resetPwd
        }
        let result=await proxy.Request({
            url:url,
            params:params,
            errorCallback:()=>{
                changeCheckCode(0)
            }
        })
        if(!result){
            return
        }
        if(opType.value==0){
            proxy.Message.success("注册成功，请登录")
            showPanel(1)
        }else if(opType.value==2){
        proxy.Message.success("密码重置成功，请登录")
            showPanel(1)
        }else if(opType.value==1){
            //登录
            const loginInfo={
                email:params.email,
                password:params.password,
                rememberMe:params.rememberMe
            }
            /*Cookie实际上是一小段的文本信息。客户端请求服务器，如果服务器需要记录该用户状态，
            就使用response向客户端浏览器颁发一个Cookie。客户端会把Cookie保存起来 */
            if(params.rememberMe){
                proxy.VueCookies.set("loginInfo",loginInfo,"7d")
            }else{
                proxy.VueCookies.remove("loginInfo")
            }
            proxy.Message.success("登陆成功")
            dialogConfig.show=false
            store.commit("updateLoginUserInfo",result.data)
        }
    })
}

const closeDialog=()=>{
    dialogConfig.show=false
    store.commit("showLogin",false)
}

</script>

<style lang="scss">
    .check-code{
        margin-left: 5px;
        cursor: pointer;
    }
.check-code-panel{
    display: flex;
}
.remember-panel{
    width: 100%;
}
.send-email-panel{
    display: flex;
     width: 100%;
    .send-mail-btn{
        margin-left: 5px;
    }
}
.no-account{
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.op-btn{
    width: 100%;
}
.notice{
    font-size: 12px; 
     line-height: 15px;
} 
</style>