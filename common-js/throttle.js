// 节流函数：限制操作频率
// para1:cb，回调函数；真正想做的操作。
// para2:wait,等待时间；多长时间操作一次。
function throttle(cb,wait){
    var timer;
    return function(){
        if(timer) return;
        timer = setTimeout(function(){
            cb();
            timer = null;
        },wait)
    }
}