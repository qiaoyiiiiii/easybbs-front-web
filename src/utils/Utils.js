export default{
    sizeToStr:(size)=>{
        var data=''
        if(size<0.1*1024){
            //如果小于0.1KB转化为B
            data=size.toFixed(2)+'B' //浮点数转换为小数保留两位小数
        }else if(size<0.1*1024*1024){
            //如果小于0.1MB转化为KB
            data=(size/1024).toFixed(2)+'KB'
        } else if (size < 0.1 * 1024 * 1024 * 1024) {
            //如果小于0.1GB转化成MB
            data = (size / (1024 * 1024)).toFixed(2) + 'MB'
        } else {
            //其他转化成GB
            data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
        }
        var sizestr = data + ''
        var len = sizestr.indexOf('.')
        var dec = sizestr.substr(len + 1, 2)
        if (dec == '00') {
            //当小数点后为00时 去掉小数部分
            return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
        }
        return sizestr
    }
}