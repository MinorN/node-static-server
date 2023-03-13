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
刚才发现 headers 里面没有请求的内容
