import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';


const server = http.createServer();

const publicDir = p.resolve(__dirname, 'public');

// 监听request事件
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const {method, url, headers} = request;
    switch (url) {
        case '/index.html':
            // __dirname 是当前目录
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
