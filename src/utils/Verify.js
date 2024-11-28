const regs={
    email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    number:/^(0|[1-9][0-9]*)$/,//零和非零开头的数字
    //必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 8-20 之间
    password:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,20}$/,
}

const  verify=(rule,value,reg,callback)=>{
    if(value){
        if(reg.test(value)){
            callback()
        }else{
            callback(new Error(rule.message))
        }
    }else{
        callback()
    }
}

export default{
    email:(rule,value,callback)=>{
        return verify(rule,value,regs.email,callback)
    },
    number:(rule,value,callback)=>{
        return verify(rule,value,regs.number,callback)
    },
    password:(rule,value,callback)=>{
        return verify(rule,value,regs.password,callback)
    }
}