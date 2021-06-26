const http = require('http');
const fs = require('fs');

let resData;

http.createServer( async (req, res) => {

    let url = req.url;

    res.setHeader('content-type', 'text/html;charset=utf-8');

    if (req.url === '/') {
        res.end( fs.readFileSync('./index.html') );
    } else {
        if (req.url === '/getData') {

            resData = await new Promise((resolve) => {
                // 不断的读取数据（数据库）
                // 如果数据与上一次的有了不一样，则返回，发送给客户端，否则不间断的去读取
                readData();

                function readData() {
                    let data = fs.readFileSync('./data.json').toString();
                    if (data == resData) {
                        // 数据没变化
                        console.log('数据没有变化');
                        setTimeout(readData, 500);
                    } else {
                        console.log('数据有变，里面发送');
                        resolve(data);
                    }
                }
            });

            res.end(resData);
        }
    }

} ).listen(8888);