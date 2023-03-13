import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';
import * as url from 'url';


const server = http.createServer();

// 找到public目录的路径
// resolve 会将两个路径拼接在一起，比如 p.resolve('/home','index.html')会返回 /home/index.html
const publicDir = p.resolve(__dirname, 'public');

// 监听request事件
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const {method, url: path, headers} = request;
    // 该语法相当于从request内读取url赋值给path
    // console.log(url.parse(path!))
    // 刷新网页，可以看到命令行里面pathname就是我们需要的
    const {pathname, search} = url.parse(path!);
    // __dirname 是当前目录
    const filename = pathname?.substr(1) || 'index.html'
    // response.setHeader('Content-Type', 'text/html;charset-utf-8');
    fs.readFile(p.resolve(publicDir, filename), (error, data) => {
        if (error) {
            response.statusCode = 404
            response.end('当前文件不存在')
        }
        response.end(data.toString());
    });
})
;

// 监听本机端口
server.listen(8888, () => {
    // console.log(server.address());
});
