(function (global, factory) {
  global.myXhr = factory();
})(this, function () {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest() // ie7+等现代浏览器
    } else if (window.ActiveXObject) { // ie5/6，老版Opera
        xhr = new ActiveXObject('Microsft.XMLHTTP')
    }
    return {
        request: (method, url, data, success, err) => {
                xhr.open(method, url);

                if (method == "GET") {
                xhr.send();
                } else {
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(data));
                }
                xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200) {
                    success(xhr.responseText);
                } else {
                    err();
                }
                };
            },
        };
    }
);
