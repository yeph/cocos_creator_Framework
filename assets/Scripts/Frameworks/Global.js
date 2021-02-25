console.log('Global')
if (window.globalData == null) {
    window.globalData = {};  
}
globalData.safeSize = {
    top:Number, 
    bottom: Number,
    left: Number, 
    right: Number, 
    width: Number, 
    height: Number 
}
globalData.IConfig = {
    /** 平台名字，区分当前上架到哪个平台*/
    platformName: String,
    version: String,
    url: String,
    urlVideo: String,
    urlAlbum: String,
    urlSound: String,
}
