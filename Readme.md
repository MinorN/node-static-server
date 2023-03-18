# Node静态服务器
## 创建项目
1. yarn init -y (创建一个package.json)
2. 新建index.ts(不熟悉ts？没事，直接干就行)
3. 运行index.ts(可以先在index.ts内log一些东西随意)(命令行运行 ts-node-dev index.ts)
4. yarn add --dev @types/node 安装node声明文件
5. 在index.ts文件内引入http模块，并且创建server
6. 监听server的request事件
7. 监听本机端口(server.listen(8888))
8. 启动server(ts-node-dev index.ts)
9. 如何请求？(curl http://localhost:8888 发送请求)

## request 对象
为什么`index.ts`里面`server`的`request`事件的`request`类型为`IncomingMessage`
可以log一下`request.constructor`就可以发现了,那么为什么需要声明类型呢？因为可以自动提示！

然后可以`curl http://localhost:8888/xxx`

同理 `response` 的类型是什么呢？——`ServerResponse`

现在请求 `curl -v http://localhost:8888`( -v 会把请求内容打出来)
发现这是一个 GET 请求，那么如何发一个 POST 请求？
`curl -v -d "name-nihao" http://localhost:8888`

## 如何得到请求消息体
刚才发现 headers 里面没有请求的内容,如何获取？
```ts
// 获取请求体数据
const array:any = []
request.on('data',(chunk)=>{
    console.log(chunk)
    array.push(chunk)
})
```
那么我什么时候知道事件结束呢？
```ts
request.on('end',()=>{
    const body = Buffer.concat(array).toString()
    console.log('body')
    console.log(body)
    response.end('hi');
})
```

## response 对象
可以去修改 response 的 statusCode
也可以往 response 上添加内容，比如:
```ts
response.setHeader('minorN','hello ,I am minorN')
```
也可以修改返回体
```ts
response.end('xxx');
// 也可以写入
response.write('1\n')
response.write('2\n')
response.write('3\n')
```

## 目标一： 根据 `url` 返回不同的文件
```ts
import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';


const server = http.createServer();
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

// 浏览器访问 http://localhost:8888/index.html
```

## 目标二： 处理查询参数
我们发现，当在浏览器地址输入 `?q=1` 直接就挂掉了，所以需要处理查询参数
可以打印以下 `url` 发现 `url` 居然带着 q
```ts
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
    switch (pathname) {
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
        default:
            response.statusCode = 404;
            response.end();
    }
});

// 监听本机端口
server.listen(8888, () => {
    // console.log(server.address());
});
```

## 目标三：匹配任意文件
我们发现现在只能匹配三个文件，如果要加一个呢？加十个呢？
```ts
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
```

## 任务四：处理不存在的文件
```ts
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
```
## 目标五：处理非GET请求
只需要对 `method` 就进行判断即可
```ts
if(method !== 'GET'){
    response.statusCode = 405
    response.end('this is a static server')
    return
}
```
## 任务六：添加缓存
刷新页面发现每次请求相同页面都会重新请求
使用 `Cache-Control`，请求成功后，先设置`Cache-Control`再响应
```ts
response.setHeader('Cache-Control','public,max-age=31536000')
```
