// 获取用户输入的账号密码

// 点击登录的操作
var form = document.querySelector("form");
form.onsubmit = function(event){
    // 阻止表单提交的默认行为
    event.preventDefault();

    // 获取表单数据
    var userName = document.querySelector("[type=text]");
    var userNameVal = userName.value;   // 获取帐号数据
    var password = document.querySelector("[type=password]");
    var passwordVal = password.value;   // 获取密码数据
    console.log(userNameVal,passwordVal);

    // input标签pattern属性定义正则格式： ^[a—zA-Z0-9\u4e00-\u9fa5]{5,8}$  （没有斜杠包裹）
    // 正则字面量格式： /^[a—zA-Z0-9\u4e00-\u9fa5]{5,8}$/
    // new RegExp() 方法直接将参数转换为正则格式。
    // 获取账号密码的正则验证。
    var userNameRegExp = new RegExp(userName.pattern);
    var passwordRegExp = new RegExp(password.pattern);
    // 验证帐号
    if(userNameRegExp.test(userNameVal)){
        // 账号符合正则验证，再验证密码
        if(passwordRegExp.test(passwordVal)){
            request({
                method:"GET",
                path:"/api/register",
                query:`userName=${userNameVal}&password=${passwordVal}`
            },function(data){
                console.log(data);
                if(data.code){
                    // alert("注册成功");
                    // 注册成功跳转至登录页面
                    location.href = "./login.html";
                }else{
                    alert("用户名已存在")
                }
            });
        }else{
            alert("密码格式不正确");
        }
    }else{
        alert("帐号格式不正确");
    }

}