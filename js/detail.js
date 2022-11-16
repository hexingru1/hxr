// 获取并处理从地址携带的数据；
// console.log(location.search);
var urlData = formatqueryString(location.search);
console.log(urlData);

// 发请求获取商品详情。
request({
    method: "GET",
    path: "/api/detail",
    query: `goodId=${urlData.goodId}`
}, function (data) {
    console.log(data[0]);
    // 小图。
    // 渲染详情页面
    render(data);
     // 添加到购物车的操作
     addCartHandle();
})
 
 function render(data){
    var smallImgs = JSON.parse(data[0].imgs);
    // console.log(smallImgs);
    var html = `
        <div>
            <div>
                <img src="${data[0].img_list_url}" alt="">
                <p class="mask"></p>
                <section style="background-image:url(${data[0].img_list_url})"></section>
            </div>
            <ul> `

    for (var i = 0; i < smallImgs.length; i++) {
        html += `<li><img src="${smallImgs[i]}" alt=""></li>`
    }

    html += ` </ul>
        </div>
        <div>
            <p>${data[0].title}</p>
            <p>${data[0].supplier}</p>
            <p>￥${data[0].price}</p>
            <p class="addCard">添加到购物车</p>
        </div>
    `
    // console.log(html)
    var commodityShow = document.querySelector(".commodityShow");
    commodityShow.innerHTML = html;
}

function addCartHandle() {
    var addCard = document.querySelector(".addCard");
    // console.log(addCard);
    // 点击按钮，进行添加购物车的操作
    addCard.onclick = function () {
        //判断本地有没有token;
        var token = localStorage.getItem("token");
        if (!token) {
            // 未登录；跳转到登录页面
            alert("请先登录");
            location.href = "./login.html";
            return;
        }

        // 添加购物车操作
        request({
            method: "GET",
            path: "/api/add",
            query: `goodId=${urlData.goodId}&token=${token}`
        }, function (data) {
            // console.log(data);
            if (data.code == 0) {
                alert("登录失效，请重新登录");
                location.href = "./login.html";
                return;
            }
            if (data.code == 1) {
                alert("添加购物车成功了");
                return;
            }
            if (data.code == 2) {
                alert("操作失败，请再次尝试");
            }
        })
    };
}



var container = document.querySelector(".container")
// 获取相似商品
request({
    method: "GET",
    path: "/api/goodList",
    query: `page=1&type_one=${urlData.keywords}`
}, function (data) {
    var html = ""
    for (var i = 0; i < 10; i++) {
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
    container.innerHTML  = html;

})

// currentEle: 触发点击的元素。
function showDetail(currentEle){
    location.href = `./detail.html?goodId=${currentEle.dataset.id}&keywords=${currentEle.dataset.keywords}`
}

