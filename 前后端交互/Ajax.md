# **Ajax**

## get和post

get传参在url中，post传参需要单独发送



使用Ajax上传文件的时候，如果通过multipart/form-data发送数据，数据必须得组织成form-data格式，FormData对象就是专门处理这个问题的

直接new一个FormData对象fd，fd.append（“参数名”，“文件”）

然后通过xhr.send(fd)就可以发送给后端了

前端页面，html文件中引用js封装的Ajax，Ajax获取html页面中上传的文件，发送给后端，后端把前端发送过来的文件存储在文件夹中，这就是最简单的上传文件的demo

前后端交互的本质，就是数据的传输，通话，你把数据给我我处理之后放在哪里，我把数据给你你再处理放在哪里

 xhr.upload 是数据上传的事件，.onloadstart上传开始时触发

onprogress是上传过程中不断触发，其中包含了上传文件的属性，包括文件大小等信息

在上传文件的input中可以开启multiple属性，可以一次性选择多个文件

文件上传进度的实现原理，就是在文件上传中设置一个长条，长条的长度跟上面的onprogress进度相匹配

（当前上传的大小/文件的总大小*100）.toFxied（2）保留两位小数 +%

# 跨域

我们知道，JScript的src标签不涉及跨域问题，就可以在页面动态创建script标签，使用get方式把需要传递的参数放在url中，赋给scrip的src中

jsonp的Ajax封装

下拉刷新原理

1. 先获取可视区的高度
2. 再获取内容的高度
3. 滚动的高度就等于内容的高度减去可视区的高度
4. 获取到当前滚动的高度
5. 如果当前滚动高度大于等于滚动高度就触发获取新的数据

# CORS解决跨域问题

**CORS** （Cross-Origin Resource Sharing，跨域资源共享）是一个系统，它由一系列传输的[HTTP头](https://developer.mozilla.org/zh-CN/docs/Glossary/HTTP_header)组成，这些HTTP头决定浏览器是否阻止前端 JavaScript 代码获取跨域请求的响应。

[同源安全策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy) 默认阻止“跨域”获取资源。但是 CORS 给了web服务器这样的权限，即服务器可以选择，允许跨域请求访问到它们的资源。

[CORS - 术语表 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Glossary/CORS)

同源策略

当使用a域下面去请求b域下面的数据，为了保护a域，请求的数据有可能是一段可执行代码，就会对a域造成不可预测的破坏，浏览器就会组织a域去获取b域的数据，实际上请求是发送到b域的，后台也给了数据，但是浏览器做了拦截，因为浏览器发现数据不是同域的。

[`Access-Control-Allow-Origin`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)

指示请求的资源能共享给哪些域。

![image-20210628185410026](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628185410026.png)

## 简单请求

![image-20210628191041780](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628191041780.png)



## 预检请求

就是当请求的数据复杂了以后，浏览器还是担心数据的安全，所以会加一道数据的检测就是预检请求，浏览器对复杂的数据进行进一步检测，通过预检请求之后就可以正常请求了

![image-20210628193750591](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628193750591.png)

注意是先发送options的预检请求，返回之后才会发送正常的数据请求

工作中最常用的是下面的后端代理（妈的搞了我半个小时理解上面的）

# 后端代理解决跨域问题

![image-20210628194114639](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628194114639.png)

![image-20210628224416664](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628224416664.png)

其实就是使用http的方法，让服务器来取数据返回数据，直接绕过浏览器（这个更烦，搞了半天还没搞好）

## koa-server-http-proxy

这个利用的就是封装好的后端代理，后端代码

![image-20210628225645787](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628225645787.png)

前端代码

![image-20210628225703063](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628225703063.png)

注意前端代码的url部分变成了/api/getuser

然后后端的pathRewrite对象中的'^/api'属性为空字符串，意思就是/api开头的url都会给你代理，然后处理url的时候自动将/api转换为空字符串，这样就是将/api/getUser转换成了/getUser，相当于没变，然后还给你代理了，当url不是/api开头的，自动往下走，不会影响其他url

# jwt鉴权

json web tokens 通过头信息的方式来鉴定用户有没有权限登录访问等等

header    payload   Signature

![image-20210628234128309](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628234128309.png)

以上代码在控制台输出的是一段字母，由header， payload   Signature三个信息，以点连接![image-20210628234225905](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628234225905.png)

当由ctx.set设置Authorization时，点击请求就会在浏览器的头信息中出现，这个就是我们所说的token值

![image-20210628234322368](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210628234322368.png)



我们需要把这个token值存起来，存到localstorage中，当我们需要验证的时候就把这个token值拿出来

当我们请求其他需要验证的网页时，网页自动对比token值，如果token值不对，就无权访问

正向代理

代理服务器和请求服务器在同一端（代理和客户端一伙）

反向代理

客户端请求>代理>代理去请求服务器   客户端不知道具体的服务端地址（代理和服务端一伙）

