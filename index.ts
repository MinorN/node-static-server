import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';

console.log('hi');

const server = http.createServer();

// 监听request事件
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    console.log('request.method');
    console.log(request.method);
    console.log('request.url');
    console.log(request.url);
    console.log('request.headers');
    console.log(request.headers);

    // 获取请求体数据
    const array: any = [];
    request.on('data', (chunk) => {
        console.log(chunk);
        array.push(chunk);
    });
    request.on('end', () => {
        const body = Buffer.concat(array).toString();
        console.log('body');
        console.log(body);
        // 可以修改 response 的 statusCode
        response.statusCode = 400
        response.end(`你的输入是${body}`);
    });
});

// 监听本机端口
server.listen(8888, () => {
    console.log(server.address());
});
