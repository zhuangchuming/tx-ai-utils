var https = require('https');
var querystring = require('querystring');
function getHttps({url,path,method,headers,params}){
    // console.log('getHttps--',url,path,method,headers)
    var reqData = [];
    var size = 0;
    let host = url.replace(/^http[s]?:\/\//,'');//去掉协议头
    // console.log('host',host)
    let opt = {hostname:host,method:method?method:'GET',path:path?path:'/'};//https没有超时请求
    if(headers){
        opt.headers = headers;
    }
    return new Promise((resolve,reject)=>{
        // console.log('getHttps',opt)
        let req = https.request(opt,(res) => {
            // console.log(`https 状态码: ${res.statusCode}`);
            // console.log(`响应头: ${JSON.stringify(res.headers)}`);
            // res.setEncoding('utf8');
            res.on('data', (data) => {
                reqData.push(data);
                size += data.length;
            });
            res.on('end',()=>{
                // console.log('end timeout',timeout)
                clearTimeout(timeout);//清楚
                // console.log('end dddd',reqData)
                reqData = Buffer.concat(reqData,size);
                reqData = reqData.toString();
                // console.log('end dddd',reqData)
                resolve({data:reqData,status:res.statusCode});
            })
        })
        req.on('error', (e) => {
            // console.log("https error-----",e)
            clearTimeout(timeout);
            resolve({error:e});
        })
        let timeout=setTimeout(()=>{
            clearTimeout(timeout);
            // console.log('https 请求超时',host);
            req.abort();
            // resolve({error:"请求超时！"});
        },4000)
        if(params)req.write(querystring.stringify(params));
        req.end();
    })
}

var http = require('http');
function get({url,path,method,headers,params}){
    // console.log('get--',url,path,method,headers)
    var reqData = [];
    var size = 0;
    let host = url.replace(/^http[s]?:\/\//,'');//去掉协议头
    let opt = {hostname:host,method:method?method:'GET',path:path?path:'/',timeout:4000};//https没有超时请求
    if(headers){
        opt.headers = headers;
    }else{
        opt.headers ={'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"}
    }
    // console.log('opt',opt)
    return new Promise((resolve,reject)=>{
        let req = http.request(opt,(res) => {
            // console.log(`http 状态码: ${res.statusCode}`);
            // console.log(`响应头: ${JSON.stringify(res)}`);
            // res.setEncoding('utf8');
            res.on('data', (data) => {
                reqData.push(data);
                size += data.length;
            });
            res.on('end',()=>{
                reqData = Buffer.concat(reqData,size);
                reqData = reqData.toString();
                // reqData = Iconv.decode(reqData, 'utf8').toString()
                // console.log('reqData',reqData)
                resolve({data:reqData,status:res.statusCode});
            })
        })
        req.on('error', (e) => {
            // console.log("http error-----",e)
            resolve({error:e});
        }).on('timeout',function(e){
            // console.log('http 请求超时',host)
            // resolve({error:'timeout'});
            req.abort();
        });
        if(params)req.write(querystring.stringify(params));
        req.end();
    })
}

exports.getHttps=getHttps;
exports.get=get;