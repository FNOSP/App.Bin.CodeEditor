# App.Bin.CodeEditor

应用包名：code.editor

显示名称：代码编辑器

版本：1.1.0

发布者：Flex_7746

## 应用说明

VS Code 同源库，支持多种编码文件的操作，更有语法高亮、代码补全。

![示例](docs/example.png)

## 本地运行

```bash
npm run install
npm run dev:frontend

# 另起 bash
npm run dev:backend
```

## 本地构建

> 请提前安装好 fnpack，如果不希望打包 fpk，可以执行 build:server

```bash
npm run install
npm run build
```

## CGI 模式说明

- 服务端：服务端将接口和 node 环境，通过 pkg 打包成 linux 运行文件，在飞牛以 cgi 的方式进行调用和返回。
- 客户端：vite 打包后，将引入文件通过服务端 api 加载