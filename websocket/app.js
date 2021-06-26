const http = require('http')
const fs =require ('fs')
const socketIo = require("socket.io")
const dayjs = require("dayjs")



let server = http.createServer((req,res)=>{
    let url = req.url
    if(url=='/') {
        res.setHeader('content-type','text/html;charset=utf-8')
        res.end(fs.readFileSync('./index.html'))
    }
})

const io = socketIo(server)

// 当有客户端通过socket连接了io服务器，那么下面on里面的函数就会被执行
io.on('connection',(socket)=>{
    console.log("a user connection");
    // 给当前连接的客户端：socket   发送一个事件
    socket.emit("hello",{
        id:socket.id,
        name:"张三"
    })
    socket.broadcast.emit('welcome',{
        id:socket.id
    })
    socket.on("message",function(data){
        let msg = {
            id: socket.id,
            message: data.message,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        socket.emit("data", msg),
        socket.broadcast.emit("data",msg)
    })
})
server.listen(9999)