/* 
1. 项目的文件结构。
2. 一级分类数据获取并展示。
3. 从首页跳转到详情页面时，告诉详情页，应该显示哪个商品的数据？页面跳转时，将goodId数据以查询字符串的方式传递到详情页。
4. 请求封装
    任意请求，步骤是一样的，都是新建请求对象，与服务器建立链接，发送请求，监听请求状态变化，解析响应数据。
    不一样的是：请求方式、资源路径、携带数据、获取数据并解析后的后续操作。
    将请求封装为一个function；
    para1:options,请求的配置对象，包含：methed、path、query。
    para2:cb,回调函数，请求成功后执行该回调函数。回调函数必然有一个参数data（请求获取的数据）
5. 分页加载的实现；监听窗口滚动事件。
    添加 节流 操作，限制滚动回调函数的执行频率。
    1）每页数据请求
    2）判断是否到底部
    3）节流
    4）分页结束：当某次加载数据，获取数据长度小于一页的数据长度，说明没有下一页了
*/

// 获取一级分类并展示
var kinds = document.querySelector(".kinds");
request({ method: "GET", path: "/api/getTypeOne" }, function (data) {
    // console.log(data);
    // 数据渲染到页面。
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += `<li><a href="./pages/kinds.html?type_one=${data[i]}">${data[i]}</a></li>`
    }
    kinds.innerHTML = html;
});

// 分页加载
// 定义变量page，记录当前显示的第几页数据，初始值1；
var page = 1;
var container = document.querySelector(".container");
function loadMore() {
    request({
        method: "GET",
        path: "/api/goodList",
        query: "page=" + page
    },function(data){
        // console.log(data);
        var html = ""
        for(var i = 0;i < data.length;i++){
            // onclick="showDetail(this)" 函数调用时，将当前元素作为参数传递(this)
            html += `
                <div class="cell" data-id="${data[i].Id}" data-keywords="${data[i].type_one}" onclick="showDetail(this)">
                    <img src="${data[i].img_list_url}" alt="">
                    <p>${data[i].title}</p>
                    <p>
                        <span> ${data[i].price} ¥</span>
                        <span>${data[i].mack}</span>
                    </p>
                </div>
            `
        }
        container.innerHTML += html;
        // 判断是否还有数据
        if(data.length < 30){
            // 不够一页，说明没有下一页
            // 可以不在监听滚动事件了;
            window.onscroll = null;
        }
    })
}
// 调用加载首屏数据
loadMore();

// 监听窗口的滚动事件
    window.onscroll = throttle( function(){
        // 可视区域高度
        var windowHeight = document.documentElement.clientHeight;
        // 页面滚动高度
        var scrollHeight = document.documentElement.scrollTop;
        // 获取html总高度
        var htmlHeight = document.documentElement.scrollHeight;
        if(windowHeight + scrollHeight >= htmlHeight - 5){
            page++;
            loadMore();
        }
    },2000);
// currentEle: 触发点击的元素。
function showDetail(currentEle){
    // console.log(currentEle.dataset.id);
    // console.log(currentEle.dataset.keywords);
    location.href = `./pages/detail.html?goodId=${currentEle.dataset.id}&keywords=${currentEle.dataset.keywords}`
}

var cart = document.querySelector(".shoppingCar");
cart.onclick = function(){
    location.href="./pages/cart.html"
}




// ----------------------------------轮播图----------------------------------------------
var carousel = document.querySelector(".carousel");
var content = document.querySelector(".content");
var leftBtn = document.querySelector(".btns>span:nth-child(1)");
var rightBtn = document.querySelector(".btns>span:nth-child(2)");
// 记录总张数
var length = 6;
var timer;
// // 记录显示张的索引，初始值是1  因为开头补了一张图，为了显示记号为一的图，所以索引为1即index=1
var index = 1;

// 轮播图的运行
timer = setInterval(function () {
    rightBtn.click()
}, 3000);


// 鼠标移入
carousel.onmouseover = function () {
    //销毁定时器
    clearInterval(timer);
}

// 鼠标移出
carousel.onmouseout = function () {
    timer = setInterval(function () {
        rightBtn.click()
    }, 3000);
}
//  向右点击

rightBtn.addEventListener('click', function () {
    // 更新索引
    index++;
    // number++;
    content.style.transition = "all 1s";
    // 内容整体左移
    content.style.left = -1200 * index + "px";
    // 注意：补充的第一张，对应0号点
    // 判断出现的是否是补充的第一张，是的话，等待补充的第一张左滑动画结束，立即调整content的left值，让真正的第一张显示出来。

    if (index == length - 1) {
        // 说明显示的是补充的第一张
        // 延迟一秒(动画时长是1S，1S后左滑动画结束)，立即调整left值
        // setTimeout  延迟定时器，延迟多少时间触发一次
        setTimeout(function () {
            // 更新索引
            index = 1;
            content.style.left = -1200 * index + "px";
            // 瞬时，无动画
            content.style.transition = "none";
            // 等待调整过后，再把动画加上
            setTimeout(function () {
                content.style.transition = "right 1s";
            }, 500);
        }, 1000)
    }
})

// 向左点击

leftBtn.addEventListener('click', function () {
    index--;
    content.style.transition = "left 1s";
    content.style.left = -1200 * index + "px";

    if (index == 0) {
        setTimeout(function () {
            index = 5;
            content.style.left = -1200 * index + "px";
            // 瞬时，无动画
            content.style.transition = "none";
            // 等待调整过后，再把动画加上
            // setTimeout(function () {

            //    content.style.transition = "left 1s";
            // }, 100);
        }, 1000)
    }
})


// --------------------------------返回顶部按钮------------------------------------------
var backtop=document.querySelector(".backtop");
window.addEventListener('scroll',function(){
//    console.log(document.documentElement.scrollTop);
   var number=document.documentElement.scrollTop;
   if(number>600){
    backtop.style.display="block";
   }
   else{
    backtop.style.display="none";
   }
})

backtop.addEventListener('click',function(){
    // document.documentElement.scrollTop=0;
    scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    })
})



// --------------------------------------------固定导航栏-----------------------------
let input = document.querySelector(".search");
let header = document.querySelector("header");
window.addEventListener("scroll", function () {
    let a = document.documentElement.scrollTop;
    console.log(document.documentElement.scrollTop);
    if (a >= "110") {
        // 向上滚动大于110的时候，header的整体向上平移100排序，这时恰好只露出首页那些元素。
        header.style.transform = "translateY(-115px)";
        header.style.position = "sticky"
        header.style.top = "0px"
        header.style.zIndex = 2
        header.style.backgroundColor = "white"
        input.style.top = "70px"
    } else {
        header.style.transform = "translateY(0px)";
        input.style.top = "50px"
    }

})



// -----------------------------------------搜索-----------------------------------------

let suosuo = document.querySelector(".button")
console.log(suosuo);
var find=document.querySelector(".find");
find.addEventListener("click", function () {
    console.log(suosuo.value);
    request({
        method: "GET",
        path: "/api/search",
        query: "word=" + suosuo.value
    }, function (data) {
        console.log(data);
        var html = ""
        for (var i = 0; i < data.length; i++) {
            // onclick="showDetail(this)" 函数调用时，将当前元素作为参数传递(this)
            html += `
                <div class="cell" data-id="${data[i].Id}" data-keywords="${data[i].type_one}" onclick="showDetail(this)">
                    <img src="${data[i].img_list_url}" alt="">
                    <p>${data[i].title}</p>
                    <p>
                        <span> ${data[i].price} ¥</span>
                        <span>${data[i].mack}</span>
                    </p>
                </div>
            `
        }
        container.innerHTML = html;
        let sw = document.querySelector(".carousel")
        sw.style.display = "none";
            
    })
})
