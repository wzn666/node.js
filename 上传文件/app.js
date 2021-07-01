const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaBody = require('koa-body');
const KoaStaticCache = require('koa-static-cache');
const jwt = require('jsonwebtoken')
const mysql = require('mysql2');

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
const router = new KoaRouter();

app.use(KoaStaticCache({
    dir: __dirname + '/public',
    prefix: '/public',
    gzip: true,
    dynamic: true
}))

app.use(KoaStaticCache({
    dir: __dirname + '/static/upload',
    prefix: '/upload',
    gzip: true,
    dynamic: true
}))

const uploadOptions = {
    multipart: true,
    formidable: {
        uploadDir: __dirname + '/static/upload',
        keepExtensions: true
    }
}
router.post('/upload', auth, KoaBody(uploadOptions), async ctx => {
    // console.log(ctx.request.files);
    let {path, type, size} = ctx.request.files.attachment;
    path = path.replace(/\\/g, '/');
    let lastIndex = path.lastIndexOf('/');
    let filename = path.substring(lastIndex + 1);
    // console.log(filename);

    let rs = await query(
        "insert into `photo` (`filename`, `type`, `size`,`uid`) values (?, ?, ?,?)",
        [filename, type, size,ctx.state.user.id]
    )

    ctx.body = {
        code: 0,
        message: '',
        data: {
            filename
        }
    };
});

router.get('/getPhotos', auth,async ctx => {
    let data = await query(
        "select * from `photo` where `uid`=?",
        [ctx.state.user.id]
    );

    ctx.body = {
        code: 0,
        message: '',
        data
    }
})

router.post('/login',KoaBody({multipart:true}), async ctx=>{
    const {name,password} = ctx.request.body
    // console.log(name,password);
    if (!name || !password) {
        return ctx.body = {
            code:1,
            message:'用户名或密码不能为空'
        }
    }
    let [data] = await query(
        "select * from `user` where `name`=? and `password` = ?",
        [name,password]
    )
    if(!data) {
        ctx.body = {
            code:2,
            message:"用户不存在或密码错误"
        }
        return
    }
    let token  = jwt.sign({id:data.id,name:data.name},'kkb')
    ctx.set('authorization',token)
    // console.log(rs);
    ctx.body = {
        code :0,
        message:'登录成功'
    }
})

app.use(router.routes());

app.listen(8888);
async function auth(ctx,next){
    let authorization = ctx.get('authorization')
    let user;
    try{
        user = jwt.verify(authorization,'kkb')
    }catch (e){

    }
    if(user){
        ctx.state.user = user;
        await next()
    }else{
        ctx.throw(401)
    }
}