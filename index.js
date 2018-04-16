const txAiSign = require("tencent-ai-sign");
let {getHttps} = require('./utils');
var app_id,app_key;

function TXinit(id,key){
	app_id=id;
	app_key=key;
}

//生成参数
function mkparams(){
	let params = {
	    "app_id":app_id,
	    "time_stamp":Date.parse(new Date())/1000,
	    "nonce_str":(Math.random()+'').substring(0,31),
	}
	return params;
}
//获取base64
function getBase64(path){
    let imageBuf = fs.readFileSync(path);
    return imageBuf.toString("base64");
}
//
function getParams(base64){
	if(!app_key||!app_id){
		return "app_key或app_id不能为空";
	}
	let params= mkparams();
	// params.image=getBase64(path);
	params.image=base64;
	params.sign = txAiSign(params,app_key);
	return params;
}


/***
OCR,获取照片内容
base64
***/
async function getOCRContent(base64){
	let params = getParams(base64);
	//获取图像识别内容
	let reqocrparams = {
		url:"https://api.ai.qq.com",
		path:'/fcgi-bin/ocr/ocr_generalocr',
		method:'POST',
		headers:{'Content-Type':'application/x-www-form-urlencoded'},
		params:params
	}
	let {data,status,error} = await getHttps({...reqocrparams});
	if(status==200){
		if(typeof data != 'object'){
			try{
				data = JSON.parse(data)
			}catch(err){
				console.error(`${path}请求异常`)
				data=null;
			}
		}
	}
	if(!data){
		console.log('error',status,data,error)
	}
	return ocr_txdeal(data);
}

function ocr_txdeal(obj){
    let strlen ='';
    for(let item of obj.item_list){
        strlen+=item.itemstring;
    }
    return strlen;
}

exports.TXinit = TXinit;
exports.getOCRContent=getOCRContent;

