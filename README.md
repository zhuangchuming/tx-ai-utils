
```
项目是基于:腾讯ai开放平台,对其api使用进行封装；
具体参数官方地址：https://ai.qq.com/
```
> 提供的api有：
1. TXinit
2. getOCRContent
3. getHandWritingocrCont
4. mergeImage


```
/**
*   初始化模块
*   id {String} 为在开放平台上注册的应用的id
*   key {string} 为对应的密钥
**/
TXinit(id,key)
```


```
/**
*   通用的ocr识别方法，该方法提供一个参数，参数类型为base64字符串；
*   base64 {String} base64字符串
*   return {string} 返回识别后的内容
**/
getOCRContent(base64)
```

```
/**
*   该方法为对图片手写体的识别
*   base64 {String} base64字符串
*   return {string} 返回识别后的内容
**/
getHandWritingocrContt(base64)
```

```
/**
*   合成图片
*   imgs {Array} base64的数组，将按顺序依次合并
*   return {String} 返回合成后的base64字符串
**/
mergeImage(imgs)
```

