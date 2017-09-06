### 静态网站： gulp & puer & ejs

#### 安装
```
$ npm install
```

#### 1. 启动
```
$ npm run start (会执行gulp和puer)
```
执行之后，打开相应的网页即可。

#### 2. 目录结构
* `/resource`：打包访问根目录
	* `m`： 手机目录

* `/scripts`：脚本代码，比如文案常量

* `/src`：前端代码
    * `/css`：mcss文件编译生成的css都放在该目录下，`*.html`中直接引用该目录下对应的`*.css`文件。
    * `/html`：模块入口文件。
    * `/mcss`：mcss文件目录
    * `/templates`： 中间模板文件，会转化为/resource下的html文件

#### 3. 参考文档
```
1. https://www.npmjs.com/package/puer
2. https://github.com/sprity/sprity
3. https://github.com/leeluolee/mcss
4. https://github.com/tj/ejs
```
