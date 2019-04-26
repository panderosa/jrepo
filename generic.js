let request = require('request');
const fs = require('fs');
const path = require('path');
const net = require('./net.js');



getFile = async (url) => {
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "GET"
    };

    return await net.sendRequest(options);
}




module.exports = {
    getFile
}