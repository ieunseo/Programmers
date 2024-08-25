// server.js

let http = require('http');
let url = require('url');

function start(route, handle) {
    console.log('이은서');
    function onRequest(request, response) {
        let pathname = url.parse(request.url).pathname;    
        let queryData = url.parse(request.url, true).query;    
        route(pathname, handle,response, queryData.productId);  // 여기서 route 함수 호출
    }

    http.createServer(onRequest).listen(8888);
}

exports.start = start;
