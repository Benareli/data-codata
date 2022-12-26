const crypto = require('crypto');
const auth = require("../config/auth.config");
const api = require("../config/api.config");

const algorithm = 'aes-256-cbc';
const key = auth.secret;
const ivs = api.iv;
//const iv = api.iv.toString("hex").slice(0, 16);
//const iv = req.headers.apikey2.toString("hex").slice(0, 16);

function encrypt(text, apikey2){
    const encrypter = crypto.createCipheriv(algorithm, apikey2, ivs.toString("hex").slice(0, 16));
    let encryptedMsg = encrypter.update(text, "utf8", "hex");
    encryptedMsg += encrypter.final("hex");
    return encryptedMsg;
};

function decrypt(hash, apikey2){
    const decrypter = crypto.createDecipheriv(algorithm, apikey2, ivs.toString("hex").slice(0, 16));
    let decryptedMsg = decrypter.update(hash, "hex", "utf8");
    decryptedMsg += decrypter.final("utf8");
    return decryptedMsg;
};

const compare = (req, res) => {
    const one = encrypt(req.headers.apikey, req.headers.apikey2);
    //const two = decrypt(api.apikey, req.headers.apikey2);
    if(one === api.apikey) return 1;
    else return 0;
}

module.exports = {
    compare
};