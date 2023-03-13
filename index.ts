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
        response.statusCode = 404
        response.setHeader('minorN','hello ,I am minorN')

        response.write('1\n')
        response.write('2\n')
        response.write('3\n')

        response.end();
    });
});

// 监听本机端口
server.listen(8888, () => {
    console.log(server.address());
});
