var token = localStorage.getItem("token");
// if(!token){
//     location.href = ""
// }

// 记录购物车数据
var shopList;

function getCartList() {
    request({
        method: "GET",
        path: "/api/shoplist",
        query: `token=${token}`
    }, function (data) {
        console.log(data);
        // 将所有购物车数据赋值给shopList
        // shopList={name:"咖啡",count:3}
        shopList = data;

        // 渲染页面
        render(data);

        // 商品数量增加的操作
        countAddHandle();

        // 商品数量减少操作
        countMinusHandle();

        // 商品删除操作
        deleteHandel();

        //商品全选
        selectAllHandle();

        // 每一个商品的选中
        selectHandle()
    })
}
getCartList();
function render(data) {
    var html = '';
    html += `<p class="summary">我的物品(${data.length})</p>`
    html += `<table>`
    html += `<tr class="row">
                <th> <input type="checkbox" id="selectAll"> 全选 </th>
                <th>商品信息</th>
                <th>单价</th>
                <th>数量</th>
                <th>金额</th>
                <th>操作</th>
            </tr>
    `
    for (var i = 0; i < data.length; i++) {
        var good = data[i];
        html += `
            <tr class="row">
                <th> <input type="checkbox" class="select"> <img src="${good.img_list_url}"> </th>
                <th>
                    <span class="title">${good.title}</span>
                    <span class="typeTwo">${good.type_two}</span>
                </th>
                <th> ${good.price}￥ </th>
                <th> 
                    <button class="countMinus" data-id="${good.Id}">-</button>
                    <span >${good.count}</span>
                    <button class="countAdd" data-id="${good.Id}"> + </button>
                </th>
                <th> ${good.price * good.count}￥</th>
                <th> <button class="del" data-id="${good.Id}">删除</button> </th>
            </tr>
        `
    }
    html += `</table>`
    html += "<p class='total'>总计：<span>0</span>￥</p>"
    var container = document.querySelector(".container")
    container.innerHTML = html;
}
// 通用方法，实现给多个标签添加事件监听
// para1: tags;多个标签构成的数组（类数组）
// para2: type;事件类型
// para3: 事件的回调函数
function eventhandle(tags, type, cb) {
    // 循环传递的标签构成的数组（tags)
    for (var i = 0; i < tags.length; i++) {
        // 给数组中的每个元素添加指定的事件，事件调用传递的 回调函数（cb)
        tags[i]["on" + type] = cb;
        // div.onclick    对象属性的两种调用方式
        // div["onclick"]
    }
}
// 商品数量增加操作
function countAddHandle() {
    var countAddBtns = document.querySelectorAll(".countAdd");
    eventhandle(countAddBtns, "click", function () {
        console.log("click_______");
        // 事件回调函数中，this表示触发事件的标签。
        console.log(this);
        request({
            method: "GET",
            path: "/api/add",
            query: `token=${token}&goodId=${this.dataset.id}`
        }, function (data) {
            // code:1 表示添加成功
            if (data.code == 1) {
                // 操作成功时，需要将页面上购物车中的该商品数量加1.
                // 第一种实现办法：重新给地址赋值，整体刷新页面；优势是代码简单，劣势是耗时，耗流量。

                // location.href = "./cart.html"
                console.log(shopList);

                // 第二种实现方法：局部修改标签中的商品数量
                // request()回调函数中的this本身指向window.
                // 这里想要使用上层函数的this，就需要给回调函数修改this指向
                // console.log(this.dataset.id);
                console.log(this); //button
                console.log(this.dataset.id);
                // 商品分数加1：根据商品的id找到商品(定义全局变量shopList记录所有商品数据数组)
                var good = shopList.find(function (value) {
                    // 这里的this原本指向window，想要使用上层函数的this，就需要修改this指向
                    return value.Id == this.dataset.id
                }.bind(this));
                console.log(good);
                good.count += 1;
                // 获取按钮前显示数量的标签。
                // 当前+1按钮的上一个兄弟。
                var countSpan = this.previousElementSibling;
                countSpan.innerHTML = good.count;
                // 商品数量改变后，商品总金额改变，获取总金额元素，需先获取当前元素的父元素，在获取父元素的下一个兄弟
                var goodTotal = this.parentElement.nextElementSibling;
                goodTotal.innerHTML = good.count * good.price + "￥"


                // 分数添加后，商品数量必然>1;这是，减1的按钮需要可以点击。
                // countSpan  商品数量，商品数量的上一个兄弟是 减1按钮。
                var countMinusBtns = countSpan.previousElementSibling;
                countMinusBtns.disabled = false;
                totalHandle();
            }
        }.bind(this)//这里绑定外层的this，外层this指向button。
        );
       

    })
}


// 商品数量减少操作

function countMinusHandle() {
    // 找到所有减一的按钮，添加添加点击事件
    var countMinusBtns = document.querySelectorAll(".countMinus");
    eventhandle(countMinusBtns, "click", function () {
        var good = shopList.find(function (value) {
            return value.Id == this.dataset.id;
        }.bind(this));
        //  找到商品数量的标签，修改标签的内容
        var countSpan = this.nextElementSibling;
        countSpan.innerHTML = good.count;
        // 找到商品总金额标签，修改标签内容
        var goodTotal = this.parentElement.nextElementSibling;
        goodTotal.innerHTML = good.count * good.price + "￥";
        totalHandle();

        // 减一 边界判断
        if (good.count == 1) {
            // disabled 禁用，true禁止使用，false不禁止。
            this.disabled = true;
            return;
        }

        //   console.log("click-----");
        // 事件回调函数中的this，指向触发事件的的元素。
        console.log(this);
        //  发请求，告诉服务器指定商品数量减1；
        request({
            method: "GET",
            path: "/api/remove",
            query: `token=${token}&goodId=${this.dataset.id}`
        }, function (data) {
            // code 0:token无效;1:成功；2：参数错误
            console.log(data);
            if (data.code == 1) {
                //  注意：需要等请求减一的操作成功了，在进行前端页面上的减一操作。(否则，如果请求减一操作失败，就酸前端页面减一写对了，刷新页面，还是减一前的数据)
                // 减一 操作成功
                // 页面上,商品数量减1;
                // 根据id找到需减一商品，商品数量减1
                console.log(good);
                good.count -= 1;


            }
        }.bind(this));
    });
}

// 删除商品操作
function deleteHandel() {
    var tbody = document.querySelector("tbody");
    // 获取所有的按钮
    var deleteBtns = document.querySelectorAll(".del");

    eventhandle(deleteBtns, "click", function () {
        // console.log("del click-------");
        var that = this;
        request({
            method: "GET",
            path: "/api/del",
            query: `token=${token}&goodId=${this.dataset.id}`

        }, function (data) {
            // code:0:token失效；1：成功；2：
            console.log(data);
            if (data.code == 1) {
                // 删除成功；
                // 从shopList数组中删除该商品
                // 根据id找到商品的索引
                // splice(开始删除的下标，删除的个数)
                var index = shopList.findIndex(function (value) {
                    return value.Id == that.dataset.id;
                })
                console.log(index);
                shopList.splice(index, 1);

                // 从页面上把这一行商品删除
                // that.parentNode.parentNode.remove(); //方法一
                var tr = that.parentNode.parentNode;
                tbody.removeChild(tr);

                //.改变商品总数
                //获取商品总数标签
                var summary = document.querySelector(".summary");
                summary.innerHTML = `我的物品(${shopList.length})`;
                
                totalHandle();
            }
        })
    })
}


// 全选按钮
function selectAllHandle() {
    //    获取全选框
    var selectAll = document.querySelector("#selectAll");
    // 所有商品选项框
    var select = document.querySelectorAll(".select");
    selectAll.onclick = function () {
        console.log("全选 click");
        // 获取全选框的选中状态
        var isChecked = this.checked;
        console.log(isChecked);
        // 每一个商品的选中状态 同全选框一致
        for (var i = 0; i < select.length; i++) {
            select[i].checked = isChecked;
        }
        totalHandle();
    }

}

// 每一个商品的选中(有一个商品没有是，是将全部取消)
function selectHandle() {
    var selectInps = document.querySelectorAll(".select");
    //   全选框
    var selectAll = document.querySelector("#selectAll");
    // 
    eventhandle(selectInps, "click", function () {
        // 判断是否所有商品都选中，是，全选选中，反之全选取消。
        // 将类数组转化为数据
        var arr = Array.from(selectInps);
        // 判断是否数组中的每一个元素都满足条件
        // every()都满足条件返回true，有一天不满足返回false
        var isAllChecked = arr.every(function (value) {
            return value.checked;
        })
        console.log(isAllChecked);
        selectAll.checked = isAllChecked;
        totalHandle();
    })
};


// 总价计算；什么时候计算总价？(在每一个按钮改变时，都要重新计算总金额)
function totalHandle(){
    // 被选中商品的单价*数量 累加
    // 所有商品选项框
    var selectInps=document.querySelectorAll(".select");
    // 记录总金额
    var total=0;
    for(var i=0;i<selectInps.length;i++){
        if(selectInps[i].checked){
            total+=shopList[i].count*shopList[i].price;
        }
    }
    var totalSpan=document.querySelector(".total>span");
    totalSpan.innerHTML=total;
}