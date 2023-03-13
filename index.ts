import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';

console.log('hi');

const server = http.createServer();

// 监听request事件
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    console.log('request.method')
    console.log(request.method);
    console.log('request.url')
    console.log(request.url);
    console.log('request.headers')
    console.log(request.headers);
    // 请求者返回给hi
    response.end('hi');
});

// 监听本机端口
server.listen(8888, () => {
    console.log(server.address());
});
