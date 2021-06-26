# websocket

首先我们创建一个app js应用   

![image-20210627004929830](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627004929830.png)

这里我们看到，引入socket.io之后，需要创建一个名为io的方法，把我们创建好的http  server放在io方法里面，这是因为socket.io是基于我们的http服务来创建的

第二步，在html文件中引入socket官方给的样式文件，最重要的是需要引入一个客户端的库

![image-20210627005214448](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627005214448.png)

这个js文件就是我们客户端浏览器需要的一个io库，不引入的话，客户端就不能正常工作，这个js文件的路径不需要改变，这个引用代码照抄就行，因为实际上在我们的app.js文件中的io方法里面，当html文件请求到这个js时，就会触发app.js文件中的io方法来提供。然后在下面js代码中加入“const socket = io（）”   这个是io提供的一个全局方法，用来构建一个socket客户端对象

![image-20210627005730710](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627005730710.png)

第三步，此时就可以运行服务了，应用中io有一个连接的方法，当服务运行吗，有客户端通过socket连接了io服务器，那么这个connection就会被触发

![image-20210627010159601](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627010159601.png)

注意上面connection中的socket对象，他的功能类似于http中的req，当有客户端连接时，socket对象就会获取当前连接的客户端的相关信息。如下图

![image-20210627010606009](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627010606009.png)

第四步，这时候我们的连接已经创建完毕了，那么前后端的通讯可以开始了。首先在app.js应用中给连接的客户端发送一个事件。这个事件是通过上面我们输出的socket对象中的方法来设置

![image-20210627011344703](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627011344703.png)

好的，我们已经把事件添加到服务端了，上面emit中的hello就是事件名称，“你好”就是事件内容，我们通过HTML文件来获取

![image-20210627011515979](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627011515979.png)

注意语法，首先一定是socket.on  因为我们上面定义的socket = io（），socket.on里面第一个参数是事件名称，后面的是事件方法，里面的e接收的就是app，里面设置的事件内容

![image-20210627011651172](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627011651172.png)

当然，实际应用中的事件数据肯定是相对复杂的，那么我们可以给hello事件后面添加复杂一点的数据

![image-20210627011959187](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627011959187.png)

同样的，我们可以在客户端获取事件数据，刚才的function里面接收的就是这个数据，接收过来的就是一个对象，如下图

![image-20210627012049420](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627012049420.png)

好的，我们已经获取到了socket的id，这时候如果想要把这个id渲染到页面就很简单了呀

![image-20210627014240023](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627014240023.png)

![image-20210627014249400](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627014249400.png)

即使聊天肯定要有通知谁谁谁上线了，那么这就是广播功能，当有人上线是，就把这个刚上线的人的信息推送给所有此时在线的socket服务端，除了刚上线的本人

这里用到的就是socket里面的broadcast.emit，这也是一个事件，跟上面我们举的例子一样，首先第一个参数是事件名称，第二个参数是事件内容（要发送的数据）

![image-20210627014948681](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627014948681.png)

同样的我们需要在客户端去接收这个事件，然后把传输的数据渲染到页面上。效果如下图

![image-20210627015059232](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627015059232.png)

![image-20210627015117405](C:\Users\武振南\AppData\Roaming\Typora\typora-user-images\image-20210627015117405.png)

首先进入socket客户端的用户会在最上面显示自己的id，然后当有其他socket客户端连接时，就会在下面显示，这里显示的信息就是我们用上面的broadcast方法搞出来的

好的，至此我们的即时聊天初步功能已经完成，可以加点修饰的东西，我们在服务端传送给客户端的数据中，可以添加时间戳修饰每条消息的发送事时间，这里注意时间戳要在服务端设置，因为客户端时间不准

