const txAiSign = require("tencent-ai-sign");
const mergeImg = require('merge-img');
const fs = require('fs')
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
    let imageBuf = require('fs').readFileSync(path);
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
base64:不包含image头部的base64内容
测试：
	与MAC命令下的base64执行后的结果一致即可
	eg: base64 1.jpg
***/
async function getOCRContent(base64){
	base64 = getBase64('./temp/1553707743813.png');
	let params = getParams(base64);
	//获取图像识别内容
	let reqocrparams = {
		url:"https://api.ai.qq.com",
		path:'/fcgi-bin/ocr/ocr_generalocr',
		method:'POST',
		headers:{'Content-Type':'application/x-www-form-urlencoded'},
		params:params
	}
	let {data,status,error} = await getHttps(reqocrparams);
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
	if(!data||!data.data||error){
		console.log('error',error)
		return null;
	}
	return ocr_txdeal(data.data);
}

/**
*	该方法为对图片手写体的识别
*	base64 String base64字符串
**/
async function getHandWritingocrCont(base64){
	let params = getParams(base64);
	//获取图像识别内容
	let reqocrparams = {
		url:"https://api.ai.qq.com",
		path:'/fcgi-bin/ocr/ocr_handwritingocr',
		method:'POST',
		headers:{'Content-Type':'application/x-www-form-urlencoded'},
		params:params
	}
	let {data,status,error} = await getHttps(reqocrparams);
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
	if(!data||!data.data||error){
		console.log('error',error)
		return null;
	}
	return ocr_txdeal(data.data);
}

function ocr_txdeal(obj){
    let strlen ='';
    for(let item of obj.item_list){
        strlen+=item.itemstring;
    }
    return strlen;
}

/**
*	imgs Array base64的数组，将按顺序依次合并
**/
function mergeImage(imgs){
	let ilist=[];
	for(let i of imgs)
	{
		ilist(Buffer.from(i, 'base64'))
	}	
	return new Promise((resolve,reject)=>{
		mergeImg(ilist)
		.then(async (img) => {
		    // Save image as file
		    let path = `temp/${Date.now()}.png`
		    img.write(path, () => {
		    	let b64 = getBase64(path);
		    	fs.unlinkSync(path)
		    	resolve(b64);
		    });
	  });
	})
}

exports.TXinit = TXinit;
exports.getOCRContent=getOCRContent;
exports.getHandWritingocrCont=getHandWritingocrCont;
exports.mergeImage=mergeImage;
