# runC

+ 要求（2018-01-19）

    * 前端显示两个输入框和一个按钮，一个填 C 代码，另一个填程序输
    
    * 点击按钮提交到 nodejs 服务器，返回代码编译后的程序的输出，并显示出来

    * 前端和服务端用 json 通信

    * 框架用 koa2。不使用 async 函数，使用 Promise + co + 生成器函数 代替 async 函数，尽量不写回调函数。

+ 运行方式
    
    * cd to root directory

    * $ npm install

    * $ npm start

+ 关于代码和文件

    * 客户端用post方法将代码传给服务端，服务端在根目录下生成**data**文件夹并将代码保存在**.c文件**中，文件名是随机生成的字符串，再进行编译和运行

    * **./routes/file.js**负责保存文件编译运行等操作，**./routes/index.js**负责设置路由，**./config/default.js**保存了服务器端口和代码文件所在文件夹名

+ History

    * 2018-01-19 start task
    * 2018-01-25 start coding
    * 2018-01-26 first commit
