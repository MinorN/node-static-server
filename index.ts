import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';


const server = http.createServer();

// 找到public目录的路径
// resolve 会将两个路径拼接在一起，比如 p.resolve('/home','index.html')会返回 /home/index.html
const publicDir = p.resolve(__dirname, 'public');

// 监听request事件
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const {method, url, headers} = request;
    switch (url) {
        case '/index.html':
            // __dirname 是当前目录
            response.setHeader('Content-Type', 'text/html;charset-utf-8');
            fs.readFile(p.resolve(publicDir, 'index.html'), (error, data) => {
                if (error) {
                    throw error;
                }
                response.end(data.toString());
            });
            break;
        case '/style.css':
            response.setHeader('Content-Type', 'text/css;charset-utf-8');
            fs.readFile(p.resolve(publicDir, 'style.css'), (error, data) => {
                if (error) {
                    throw error;
                }
                response.end(data.toString());
            });
            break;
        case '/main.js':
            response.setHeader('Content-Type', 'text/javascript;charset-utf-8');
            fs.readFile(p.resolve(publicDir, 'main.js'), (error, data) => {
                if (error) {
                    throw error;
                }
                response.end(data.toString());
            });
            break;
    }
});

// 监听本机端口
server.listen(8888, () => {
    console.log(server.address());
});
