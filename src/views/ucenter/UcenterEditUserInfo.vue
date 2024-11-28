<template>
 <Dialog
   :show="dialogConfig.show"
   :title="dialogConfig.title"
   :buttons="dialogConfig.buttons"
   width="400px"
   :showCancel="false"
   @close="dialogConfig.show = false">

   <el-form
     :model="formData"
     ref="formDataRef"
     label-width="40px"
     @submit.prevent
   >
     <el-form-item label="昵称" prop="nickName" >
         <el-input clearable placeholder="请输入昵称" 
         v-model="formData.nickName"
         :width=100></el-input>
       </el-form-item>
     <el-form-item label="头像" prop="avatar">
        <CoverUpload
          :imageUlrPrefix="proxy.globalInfo.avatarUrl"
          v-model="formData.avatar"
        ></CoverUpload>
      </el-form-item>
     <!--input输入-->
       <el-form-item label="简介" prop="" >
         <el-input 
         clearable 
         rows="3"
         placeholder="请输入简介" 
         v-model="formData.personDescription"
         :width=100></el-input>
       </el-form-item>
   </el-form>
 </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch,nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  updateUserInfo: "/ucenter/updateUserInfo",
};

const dialogConfig = reactive({
  show: false,
  title: "编辑个人信息",
  buttons: [
   {
    type: "danger",
    text: "确定",
    click: (e) => {
      updateUserInfoHandler()
    },
  },
 ],
});

const formData = ref({});
const formDataRef = ref();

const emit=defineEmits(["resetUserInfo"])
const updateUserInfoHandler=()=>{
formDataRef.value.validate(async(valid)=>{
if(!valid) return
let params=Object.assign({},formData.value)
let result = await proxy.Request({
   url:api.updateUserInfo,
   params:params
})
if(!result){
  return;
}
dialogConfig.show=false
if(params.avatar instanceof File){
  router.go(0)
}else{
  emit("resetUserInfo",params)
}
})
}

const showEditUserInfoDialog=(userInfo)=>{
  dialogConfig.show=true
  nextTick(()=>{
    formDataRef.value.resetFields()
    const dataInfo=JSON.parse(JSON.stringify(userInfo))
    dataInfo.avatar={
      ImageUrl:dataInfo.userId
    }
    formData.value=dataInfo
  })
}

defineExpose({showEditUserInfoDialog})
</script>

<style lang="scss" scoped>

</style>
