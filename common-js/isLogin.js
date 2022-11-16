var token = localStorage.getItem("token");
// 用户未登录需显示
var unlogin = document.querySelector(".unlogin");
// 用户已登录显示
var login = document.querySelector(".login");
console.log(token, unlogin, login);
if (token) {
    login.style.display = "flex";
    unlogin.style.display = "none";
} else {
    login.style.display = "none";
    unlogin.style.display = "flex";
}

var goLogin = document.querySelector(".goLogin");
var register = document.querySelector(".register");
var isHome = location.href.includes("home.html");
console.log(isHome);
// console.log(location.href)  获取完整url链接
// console.log(location.search)  获取url ?之后携带的数据
goLogin.onclick = function () {
    if (isHome) {
        location.href = "./pages/login.html"
    } else {
        location.href = "./login.html"
    }
}

register.onclick = function () {
    if (isHome) {
        location.href = "./pages/register.html"
    } else {
        location.href = "./register.html"
    }
}





