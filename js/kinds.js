// // 获取当前选中的一级分类，给该分类添加样式

// // 从地址栏获取一级分类
// var arr = location.search.split("=");
// var type_one = arr[1];
// // console.log(type_one);
// //urldecode 解码  (网址上的中文默认会进行urlencode, 可以进行urldeocde解码)。 encode:编码；decode:解码 ; component:片段、一部分、组件。
// // URI:统一资源标识符 uniform resource identifier（能够唯一标识一项资源的标识符，都是URI,例如 磁盘上的文件路径，网址...） ; URL是一种特殊的URI。

// // 解码URI片段。
// // para1:被编码的数据；
// // return：解码后的数据
// type_one = decodeURIComponent(type_one);
// // console.log(type_one);

// // 获取一级分类并展示
// request({
//     method: "GET",
//     path: "/api/getTypeOne"
// }, function (data) {
//     // 数据渲染到页面上
//     var html = "";
//     for (var i = 0, len = data.length; i < len; i++) {
//         // ${表达式} 
//         // 判断该li展示的分类，与 当前页的 type_one是否一致，一致时添加class.
//         html += `<li class="${data[i] == type_one ? 'purpleBg' : ''}"><a href="./kinds.html?type_one=${data[i]}">${data[i]}</a></li>`;
//     }
//     var ul = document.querySelector(".kinds");
//     ul.innerHTML = html;
// });


// // 根据一级分类，获取该分类下的所有商品
// request({
//     method: "GET",
//     path: "/api/goodList",
//     query: `type_one=${type_one}`
// }, function (data) {
//     // 根据商品数组得到二级分类数组；
//     var typeTwoList = getTypeTwoList(data);
//     // 生成结果数组
//     var resultArr = goodListFormat(data,typeTwoList);

//     // 渲染页面
//     // 生成侧边栏二级菜单
//     renderAsiddeMenu(resultArr);

//     // 生成主体内容
//     renderMain(resultArr); 

//     // 页面
//     clickAsideMenu();
//     windowScrollHandle();
// });
// // 从商品数据中获取二级分类
// function getTypeTwoList(data) {
//     // 1. 得到所有的二级分类（map:数组映射）
//     var typeTwoList = data.map(function (value) {
//         return value.type_two;
//     })
//     // 2. 二级分类数组去重
//     // 将数组转化为集合，再讲集合转化为数组；set:设置、集合（集合的一大特点是元素不重复；因此，将数组转化为集合时，会自动去重。
//     var set = new Set(typeTwoList);
//     typeTwoList = Array.from(set);
//     return typeTwoList;
// }

// //商品数据格式化（从一种格式转化为满足需求的另一个格式）
// function goodListFormat(data,typeTwoList){
//     // console.log(data,typeTwoList);
//     var resultArr = [];
//     // 遍历二级分类的数组
//     for(var i = 0;i < typeTwoList.length;i++){
//         // 一个二级分类，对应一个对象了，对象中包含两个字段，type_two就是二级分类，list：是该二级分类下的所有商品。
//         // 过滤商品数组，得到该二级分类下的商品。
//         var list = data.filter(function(value){
//             return value.type_two == typeTwoList[i]
//         })
//         // console.log(list);
//         var obj = {
//             type_two:typeTwoList[i],
//             list:list
//         }
//         resultArr.push(obj);
//     }
//     // console.log(resultArr);
//     return resultArr;
// }

// // render:渲染；menu：菜单
// // 渲染侧边栏二级菜单
// function renderAsiddeMenu(typeTwoList){
//     // console.log(typeTwoList);
//     var html = "";
//     for(var i = 0;i < typeTwoList.length;i++){
//         html +=  `<li> ${typeTwoList[i].type_two} </li>`
//     }
//     var typeTwo = document.querySelector(".typeTwo");
//     typeTwo.innerHTML = html;
// }

// // 渲染主体、商品数据
// function renderMain(resultArr){
//     console.log(resultArr);
//     var html = "";
//     for(var i = 0;i < resultArr.length;i++){
//         console.log(resultArr[i].type_two);
//         html+=`
//             <section>
//                 <h2 class="title">${resultArr[i].type_two}</h2> 
//                 <div class="list">
//         `
//         for(var x = 0;x < resultArr[i].list.length;x++){
//             var good = resultArr[i].list[x];
//             // console.log(good.title);
//             html += `
//             <div class="cell" data-id="${good.Id}" data-keywords="${good.type_one}" onclick="showDetail(this)">
//                     <img src="${good.img_list_url}" alt="">
//                     <p>${good.title}</p>
//                     <p>
//                         <span>${good.price}</span>
//                         <span>${good.mack}</span>
//                     </p>
//                 </div>
//             `
//         }
//         html += `</div></section>`
//     }
//     var main = document.querySelector(".container");
//     main.innerHTML = html;
// }; 

// // 点击侧边栏的操作
// function clickAsideMenu(){
//     // 给侧边栏添加点击事件
//     // 自己写
// };
// // 窗口的滚动操作
// function windowScrollHandle(){
//     // 监听窗口的滚动事件。
//     // 加油，自己写。
// };
// // currentEle: 触发点击的元素。
// function showDetail(currentEle){
//     // console.log(currentEle.dataset.id);
//     // console.log(currentEle.dataset.keywords);
//     location.href = `./detail.html?goodId=${currentEle.dataset.id}&keywords=${currentEle.dataset.keywords}`
// }

// /* 
//     1. 请求是耗时操作，回调函数不会立即执行，是等待请求结束才执行回调函数。
//         连着发送多个请求，那个请求先完成，是不确定的。
//     2. 查找标签必须在标签都添加到页面之后，否则找不到标签。（注意：代码的执行顺序）
//     3. 每个函数，都只实现一项功能，尽可能不要太长，一般情况就是一显示屏可以显示完一个函数。可以将一个复杂功能，拆分为多个小功能，一个小功能就是一个函数。
//     4、第三方组件库
//     第三方：不是H5的官方、也不是自己。
//     使用第三方组件库的好处：提高开发效率。

//      bootstrap:前端的一个框架(组件库),写好了很多的样式。下载bootrap的资源文件，引入到自己的项目中,编写自己的html结构时，可以添加class,从而匹配上bootrap提供的样式进而使用。
//     5、注册时，会把账号、密码发送到服务器，注册成功时，服务器会将你注册的账号、密码保存在数据库中。
//     登录时，将用户输入的账号、密码发送到服务器，服务器会将收到的账号密码 与 数据库现有的账号密码进行比较； 先去找账号，找不到，账号不存在，给前端响应，账号不存在登录失败; 找到账号，比较密码一致不，不一致，给前端响应，密码错误，登录失败；找到账号、密码也一直，给前端响应，登录成功。

//     6、清空表单 form.reset();

//     7、token:令牌; 是一个身份凭证，用来鉴别用户身份；通常，登录成功后，服务器会返回一个token，浏览器端需要将这个token保存下来。之后，一些需要识别用户身份的请求就需要携带这个token,服务器接到请求，从请求中拿到token就可以知道这个用户的身份。

//     8、localStorage: 怎么存、怎么取、怎么删
//         setItem\getItem\removeItem;
//         是持久化存储
//         不能存储复杂类型；复杂类型(数组、对象)需要通过JSON.stringfy方法转化为字符串再存储

//     9、怎么通过http协议访问编写的网页？
//     给vscode安装扩展(插件):在扩展中搜索 Live Server ; 安装完成，看VSCode的右下角，有一个 Go Live的按钮；点击这个按钮，会启动一个服务器，端口号是5500；接下来，就可以在浏览器上通过 http协议访问自己编写的网页； http://localhost:5500; 默认会从项目的根目录中找index.html文件 ； 没这个文件的话，http://localhost:5500/html文件名称；  
//     // localhost:本机域名; 127.0.0.1:本地地址; 192.168.0.128:本机在局域网下的地址。

//     通过npm 安装 anywhere ; 开启一个服务器；
//     win+R把终端打开，输入 npm i anywhere -g 后回车；
//     cd 文件路径；回车; 进入项目路径;
//     输入 anywhere ,就可以 开启一个服务器,端口号默认是8000；
//     接下来就可以通过 http://localhost:8000访问页面；
// */
// /*
//     [
//         {
//             type_two:"连衣裙",
//             list:[]  // 连衣裙相关商品
//         },
//         {
//             type_two:"T恤",
//             list:[]  // T恤相关商品
//         },
//     ]
// */

// 获取当前选中的一级分类
var type_one = location.search.split("=")[1];
console.log(type_one);
// decodeURI():url解码
type_one = decodeURI(type_one)
console.log(type_one);
var kinds = document.querySelector(".kinds")
request({
    method: "GET",
    path: "/api/getTypeOne"
}, function (data) {
    // 数据渲染页面
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += `<li><a href="./kinds.html?type_one=${data[i]}">${data[i]}</a></li>`
    }
    kinds.innerHTML = html;
});

//获取二级分类页面展示
// var TypeTwo = document.querySelector(".typeTwo");
// request({
//     method: "GET",
//     path: "/api/getTypeTwo",
//     query: `type_one=${type_one}`
// }, function (data) {
//     var html = "";
//     for (var i = 0; i < data.length; i++) {
//         // console.log(data[i]);
//         html += `<li>${data[i]}</li>`
//     }
//     TypeTwo.innerHTML = html;

//     //遍历二级分类数组，发送请求，获取该二级分类下的商品列表。
//     // 不推荐for循环遍历，发送多个请求
//     for (var k = 0; k < data.length; k++) {
//         console.log(data[k]);
//         request({
//             method: "GET",
//             path: "/api/getTypeTwoList",
//             query: `type_one=${type_one}&type_two=${(data[k])}`
//         }, function (data) {
//             console.log(data);
//         })
//     }
// })


// 根据一级分类，获取该一级分类下的所有商品
request({
    method: "GET",
    path: "/api/goodList",
    query: `type_one=${type_one}`
}, function (data) {
    console.log(data);

    // 将商品按照二级分类分组

    // 1、得到所有的二级分类（map:数组映射）
    // 获取数组每个元素中的type_two属性，返回一个数组。
    var typeTwoList = data.map(function (value) {
        return value.type_two;
    })
    console.log(typeTwoList);

    // 2.二级分类数组去重
    // 将数组转化为集合，在将集合转化为数组：set:设置，集合。(集合的一大特点是元素不重复；因此，将数组转化为集合时，会自动去重)
    var set = new Set(typeTwoList);
    console.log(set);
    // 使用Array.from()方法，转化为数组
    typeTwoList = Array.from(set)
    console.log(typeTwoList);

    //  生成结果数组
    // 循环所有数据typeTwoList数组中的二级标题进行判断，相同则放置同类产品列表中，数据处理格式如下：
    /*  var resultArr=[
         {
             type_two:"连衣裙",
             list:[
                 {},{}
             ]
         },
         {
             type_two:"T恤",
             list:[
                 {},{}
             ]
         },
     ] */
    var resultArr = [];
    // 遍历二级数组
    for (var x = 0; x < typeTwoList.length; x++) {
        console.log(typeTwoList[x]);
        // 一个二级分类，对应一个对象，对象中包含两个字段，type_two就是二级分类，list是该二级分类下的所有商品。
        // 过滤商品数组，得到该二级分类下的商品。
        var list = data.filter(function (value) {
            console.log(value.type_two);
            return value.type_two == typeTwoList[x];
            // 循环所有商品type_two==""
        })
        console.log(list);


        var obj = {
            type_two: typeTwoList[x],
            list: list
        }

        console.log(obj);
        resultArr.push(obj);

        console.log(resultArr);
    }

    let html1 = ""
    let aside = ""
    let container = document.querySelector(".container")
    let typeTo = document.querySelector(".typeTwo")
    for (let a = 0; a < resultArr.length; a++) {
        console.log(resultArr.length);
        html1 += `
        <h1>${resultArr[a].type_two}</h1></br>
        `
        aside += `<li>${resultArr[a].type_two}</li>`
        for (var i = 0; i < resultArr[a].list.length; i++) {
            // onclick="showDetail(this)" 函数调用时，将当前元素作为参数传递(this)
            html1 += `
            <div class="cell" data-id="${resultArr[a].list[i].Id}" data-keywords="${resultArr[a].list[i].type_one}" onclick="showDetail(this)">
                <img src="${resultArr[a].list[i].img_list_url}" alt="">
                <p>${resultArr[a].list[i].title}</p>
                <p>
                    <span> ${resultArr[a].list[i].price} ¥</span>
                    <span>${resultArr[a].list[i].mack}</span>
                </p>
            </div>
        `
        }
        // console.log(resultArr[a].list);
    }
    container.innerHTML += html1;
    typeTo.innerHTML += aside;
})

// currentEle:触发点击的元素
function showDetail(currentEle) {
    console.log(currentEle.dataset.id);
    console.log(currentEle.dataset.keywords);
    location.href = `./detail.html?goodId=${currentEle.dataset.id}&keywords=${currentEle.dataset.keywords}`
}



// ------------------------------------返回顶部按钮--------------------------------
var backtop = document.querySelector(".backtop")
// 给整个页面添加一个滚动事件，使其滚动到一定程度时返回顶部按钮出现
window.addEventListener('scroll', function () {
    // console.log(document.documentElement.scrollTop);
    var number = document.documentElement.scrollTop;
    if (number > 800) {
        backtop.style.display = "block";
    }
    else {
        backtop.style.display = "none";
    }
})
// 给div(返回顶部按钮)添加一个点击事件，点击按钮的时候使其返回顶部，即document.documentElement.scrollTop=0;
backtop.addEventListener("click", function () {
    scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    })
})



let timer = null;
let container = document.querySelector(".container");
// axaj必须设置时间间隔才可以执行
timer = setInterval(function () {
    // 如果内容的字节点的长度不等于0
    if (container.childNodes.length != 0) {
        // 清空时间间隔
        clearInterval(timer);
        timer = null;
        // h1指的是每个页面的分类标签
        let h1 = document.querySelectorAll("h1");
        // li:指左侧侧边栏的每一个内容
        let li = document.querySelectorAll(".typeTwo>li");
        for (let i = 0; i < li.length; i++) {
            li[i].addEventListener('click', function () {
                let h = h1[i].offsetTop;
                console.log(li[i]);
                if (i == 0) {
                    scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth"
                    })
                } else {
                    scrollTo({
                        top: h - 50,
                        left: 0,
                        behavior: "smooth"
                    })
                }
            })

            window.addEventListener("scroll", function () {
                let l = document.documentElement.scrollTop;
                for (let j = 0; j < li.length; j++) {
                    if (l > h1[j].offsetTop - 100) {
                        for (let k = 0; k < li.length; k++) {
                            li[k].style.fontWeight = "normal";
                            li[k].style.textShadow = "none";
                        }
                        li[j].style.fontWeight = "bolder"
                        li[j].style.textShadow = "5px 5px 8px purple"
                    }
                }
            })

        }
    }
}, 500)