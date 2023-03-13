import * as http from 'http';

console.log('hi');

const server = http.createServer();

// 监听request事件
server.on('request', (request,response) => {
    console.log('请求了');
    // 请求者返回给hi
    response.end('hi')
});

// 监听本机端口
server.listen(8888);
