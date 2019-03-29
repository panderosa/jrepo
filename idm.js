let request = require('request');
const fs = require('fs');
const path = require('path');


function initConfig(configFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(configFile, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                var content = JSON.parse(data.toString());
                //console.log(content);
                resolve(content);
            }
        });
    });
}

function getAuthorization(user, password) {
    return "Basic " + Buffer.from(user + ":" + password).toString('base64');
}

function getToken(suite, env, user, tenant) {
    var url = env[suite]['service']['idm'] + env[suite]['path']['token'];
    var transportUser = "idmTransportUser";
    var password = env[suite]['login'][transportUser];
    var auth = getAuthorization(transportUser, password);
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": auth
        },
        json: true,
        body: {
            "passwordCredentials": {
                "username": user,
                "password": env[suite]['login'][user]
            },
            "tenantName": tenant
        }
    };

    //console.log("options => " + JSON.stringify(options));

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (!err && (res.statusCode === 200 || res.statusCode === 201)) {
                resolve(body.token.id);
            }
            else {
                if (err) {
                    reject(err);
                }
                else {
                    var rp = JSON.stringify(res.body);
                    var out = `status code: ${res.statusCode}\n \
body: ${rp}`
                    reject(out);
                }
            }
        });
    })
}

module.exports = {
    initConfig,
    getAuthorization,
    getToken
}

