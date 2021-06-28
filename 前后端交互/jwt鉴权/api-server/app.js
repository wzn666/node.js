const Koa = require('koa');
const KoaRouter = require('@koa/router');
const KoaBody = require('koa-body');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken')

// 创建一个mysql的链接对象
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456789',
    database: 'photo'
});

function query(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, function(err, results) {
            if (err) {
                reject(err);
            } else{
                resolve(results);
            }
        });
    })
}

const app = new Koa();

let users = [
    {
        id: 1,
        name: "hello",
        password:123456
    },
    {
        id: 2,
        name: "world",
        password: 123456
    }
]

const router = new KoaRouter();

router.get('/api',async ctx=>{
    if(ctx.get('Authorization')){
        let token  = ctx.get('Authorization')
        let decode = jwt.verify(token,'kaikeba')
        console.log(decode);
    }
    

    ctx.body = '欢迎使用API'
})
router.post('/login',async ctx=>{

    // 验证通过了
    let token = jwt.sign({id:1,name:"hello"},"world")
    console.log('token',token);

    ctx.set('Authorization','Bearer' + token)
    ctx.body = "登录成功"
})

router.get('/getUser',async ctx=>{
    ctx.body =users

})

router.post(
    '/post',
    KoaBody({
        multipart:true
    }),
    ctx=>{
        console.log(ctx.request.body);
        ctx.body = "提交成功"
})

app.use( router.routes() );


app.listen(8888);