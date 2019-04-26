const fs = require('fs');
const path = require('path');
const config = require('./config.js');
const env = config.read();
const net = require('./net.js');

function getBasicAuth(user, password) {
    return "Basic " + Buffer.from(`${user}:${password}`).toString('base64');
}

listScripts = async (suite) => {
    var url = env[suite].service.api + '/javascriptstore';
    var auth = getBasicAuth('admin', env[suite]['login']['admin']);
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": auth
        },
        json: true
    };

    return await net.sendRequest(options);
}

getScript = async (suite,scriptName) => {
    //var snm = encodeURIComponent(scriptName);
    var url = env[suite].service.api + `/javascriptstore/${scriptName}`;
    var auth = getBasicAuth('admin', env[suite]['login']['admin']);
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "GET",
        headers: {
            "Authorization": auth
        }
    };
    return await net.sendRequest(options);
}


module.exports = {
    listScripts,
    getScript
}