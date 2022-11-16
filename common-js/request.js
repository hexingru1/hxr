// const:常量，constant；一经赋值，无法修改。常量的名称通常以纯大写表示。
const HOST = "http://123.57.142.211:8080";
// para1:对象，调用函数时，传递请求路径、参数...
// {path:"/api/goodList",query:"page=1",method:"GET"}
// para2:回调函数。
function request(options, cb) {
    var xhr = new XMLHttpRequest();
    var url = HOST + options.path;
    if (options.query) {
        url += "?" + options.query;
    }
    xhr.open(options.method, url);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // console.log(xhr.responseText);
            var data = JSON.parse(xhr.responseText);
            cb(data);
        }
    }

}
// http://123.57.142.211:8080/api/goodList?page=1