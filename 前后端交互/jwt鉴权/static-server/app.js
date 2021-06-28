const Koa = require('koa')
const KoaStatic = require('koa-static-cache')
const KoaSeverHttpProxy = require('koa-server-http-proxy')

const app = new Koa()

app.use(KoaSeverHttpProxy('/api', {
    target: 'http://localhost:8888',
    pathRewrite: {
        '^/api': ''
    },
    changeOrigin: true
}))

app.use(KoaStatic({
    prefix:'/',
    dir:__dirname + '/static',
    gzip:true,
    dynamic:true
}))

app.listen(9988)