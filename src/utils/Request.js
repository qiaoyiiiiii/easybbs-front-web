import axios from "axios"
import { ElLoading } from "element-plus"
import  Message from "./message"
import store from "@/store";
const contentTypeForm="application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson="appliction/json"

const instance =axios.create({
    baseURL:"/api",
    timeout:30*1000,
})

//请求前过滤器
let loading=null;
instance.interceptors.request.use(
    (config)=>{
    if(config.showLoading){
        loading=ElLoading.service({
            lock:true,
            text:'加载中………',
            background:'regb(0,0,0,7)'
        })
    }
    return config;
},(error)=>{
if(error.config.showLoading && loading){
    loading.close();
}
Message.error("请求发送失败");
return Promise.reject("请求发送失败")
})

//请求后过滤器
instance.interceptors.response.use(
    (response)=>{
    const {showLoading,errorCallback,showError}=response.config;
    if(showLoading && loading){
            loading.close();
    }
    const responseData =response.data;
    if(responseData.code==200){
        return responseData;
    }else if(responseData.code==901){
        store.commit("showLogin",true) 
        store.commit("updateLoginUserInfo",null)
        return Promise.reject({showError:false,msg:"登录超时"});
    }else{
        if(errorCallback){
            errorCallback(responseData);
        }
        return Promise.reject({showError:showError,msg:responseData.info})
    }

    },(error)=>{
   if(error.config.showLoading && loading){
    loading.close()
   }
   return Promise.reject({showError:true,msg:"网络异常"})
})

const request=(config)=>{
const {url,params,dataType,showLoading=true,errorCallback,showError=true}=config
let contentType=contentTypeForm;
let formData=new FormData();
for(let key in params){
    formData.append(key,params[key]);
}
if(dataType!=null&&dataType==="json"){
    contentType=contentTypeJson;
}
let headers={
    'Content-Type':contentType,
    'X-Requested-With':'XMLHttpRequest',
}
return instance.post(url,formData,{
    headers,
    showLoading,
    errorCallback,
    showError:showError
}).catch(error=>{
    if(error.showError){
        Message.error(error.msg);
    }
    return null;
})
}

export default request;