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
            console.log(error)
            if(error.errno === -4058){
                // 这种错误才是文件不存在
                response.statusCode = 404
                fs.readFile(p.resolve(publicDir,'404.html'),(error,data)=>{
                    response.end(data)
                })
            }else if(error.errno === -4068){
                response.statusCode = 403
                response.end('无权查看目录内容')
            }else{
                response.statusCode = 500
                response.end('服务器繁忙')
            }
        }else{
            response.end(data);
        }
    });
})
;

// 监听本机端口
server.listen(8888, () => {
    // console.log(server.address());
});
