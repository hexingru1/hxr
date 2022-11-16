// 将查询字符串转换为对象。
function formatqueryString(str) {
    str = decodeURI(str);
    var result = {};
    var arr = str.slice(1).replaceAll("&", "=").split("=");
    for (var i = 0; i < arr.length; i += 2) { // 只会循环0 2
        result[arr[i]] = arr[i + 1];
    }
    return result;
}