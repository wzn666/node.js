const Koa = require('koa')
const KoaStatic = require('koa-static-cache')

const app = new Koa()




app.use(KoaStatic({
    prefix:'/',
    dir:__dirname + '/static',
    gzip:true,
    dynamic:true
}))

app.listen(9999)