let request = require('request');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');
const env = config.read();


async function sendRequest(options) {
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (!err && (res.statusCode === 200 || res.statusCode === 201)) {
                resolve(body);
            }
            else {
                if (err) {
                    reject(err);
                }
                else {
                    var rp = JSON.stringify(res.body);
                    var out = `status code: ${res.statusCode}\n` + `body: ${rp}`;
                    reject(out);
                }
            }
        });
    })
}

async function getJWTToken(suite) {
    var url = env[suite]['service']['ucmdb'] + "/authenticate";
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "POST",
        json: true,
        body: {
            "username": env[suite]['ucmdb-admin'].user,
            "password": env[suite]['ucmdb-admin'].password,
            "clientContext": 1
        }
    };
    var out = await sendRequest(options);
    return out.token;
}

async function launchQuery(suite,token,query) {
    var url = env[suite]['service']['ucmdb'] + "/topology";
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "POST",
        body: query,
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
    };
    var out = await sendRequest(options);
    return out;
}



async function main() {
    try {
    var token = await getJWTToken('EMEA');
    var output = await launchQuery('EMEA',token,'unix_query');
    console.log(output);
    }
    catch(error) {
        console.log(error);
    }
}

main();