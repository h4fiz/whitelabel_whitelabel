/*
    need dependency aes.js, aes-ctr.js, json.js 
*/

var CRYPTO = new function(){
	this.privateKey ="{([<.?*+-#!,>])}";
    this.keyLength = 16;
    
    this.setPrivateKey = function(newKey){
        this.privateKey = newKey;  
    };
    
    this.generateKey = function(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < this.keyLength; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;	
    };
    this.encrypt = function(data){
        var publicKey = this.generateKey();
        var enc = Aes.Ctr.encrypt(JSON.stringify(data), publicKey+this.privateKey, 256);
        //console.log(publicKey);
        var jsonData = JSON.stringify(publicKey+enc);

        return jsonData;
    };
    this.decrypt = function(respone){
        
        var publicKey = respone.substring(0,16);
        var data = respone.substring(16);
        var dec = Aes.Ctr.decrypt(data, publicKey+this.privateKey, 256 );
        
        return JSON.parse(dec);
    };
}