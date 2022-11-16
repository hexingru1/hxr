// 获取用户输入的账号密码

// 点击登录的操作
var form = document.querySelector("form");
form.onsubmit = function (event) {
    // 阻止表单提交的默认行为
    event.preventDefault();

    // 获取表单数据
    var userName = document.querySelector("[type=text]");
    var userNameVal = userName.value;   // 获取帐号数据
    var password = document.querySelector("[type=password]");
    var passwordVal = password.value;   // 获取密码数据
    console.log(userNameVal, passwordVal);

    // input标签pattern属性定义正则格式： ^[a—zA-Z0-9\u4e00-\u9fa5]{5,8}$  （没有斜杠包裹）
    // 正则字面量格式： /^[a—zA-Z0-9\u4e00-\u9fa5]{5,8}$/
    // new RegExp() 方法直接将参数转换为正则格式。
    // 获取账号密码的正则验证。
    var userNameRegExp = new RegExp(userName.pattern);
    var passwordRegExp = new RegExp(password.pattern);
    // 验证帐号
    if (userNameRegExp.test(userNameVal)) {
        // 账号符合正则验证，再验证密码
        if (passwordRegExp.test(passwordVal)) {
            request({
                method: "GET",
                path: "/api/login",
                query: `userName=${userNameVal}&password=${passwordVal}`
            }, function (data) {
                console.log(data);
                if (data.code == 0) {
                    alert("账户不存在");
                    // 清空表单，reset:重置
                    form.reset();
                    return;
                }
                if (data.code == 1) {
                    alert("密码错误，请重新输入");
                    // 清除密码
                    document.querySelector("[type=password]").value = "";
                    return;
                }
                alert("登录成功，即将跳转到首页");

                /* 
                登录成功返回的数据：
                {
                    code:2,
                    token:"sgfhjsghjsdgjs",
                    username:"lucy"
                }
                */
                /* 
                token:令牌；是一个身份凭证，用来鉴别用户身份；通常，登录成功后，服务器会返回一个token，浏览器需要将这个token保存下来。之后，一些需要识别用户身份的请求就需要携带这个token，服务器接收到请求，从请求中拿到token就可以知道这个用户的身份。
         
                localStorage：存、取、删。
                     setItem\getItem\removeItem
                
                */
                // 浏览器端存储数据；local：本地；storage:存储；
                // 本地存储；只能存储基本类型的数据，复杂类型（数组、对象）需要通过JSON.stringify转化为字符串再存储。是持久化存储（不删除就一直存在，即使浏览器关闭）。本地存储最多存储5M的数据。

                localStorage.setItem("token", data.token);
                location.href = "../home.html";
            })
        } else {
            alert("密码格式不正确");
        }
    } else {
        alert("帐号格式不正确");
    }
}
/* 
    作业：
        首页（触底加载更多、轮播图）
        详情（点小图切换大图、大图放大镜）
        二级分类页面（左右联动）

        注册页面
        登录页面
        每个页面头部，登录状态的判断（提取公共文件）
        添加购物车操作、购物车操作
*/