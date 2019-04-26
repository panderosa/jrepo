let request = require('request');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');

function getAuthorization(user, password) {
    return "Basic " + Buffer.from(user + ":" + password).toString('base64');
}

sendRequest = async (options, good) => {
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    var good = good || [200];
    return new Promise((resolve, reject) => {
        request(options, (err, res, data) => {
            if (!err && good.hasIntance(res.statusCode)) {
                console.log(`res.body *****\n ${res.body}`)
                resolve(data);
            }
            else {
                if (err) {
                    reject(err);
                }
                else {
                    var rp = JSON.stringify(res.body);
                    var out = `status code: ${res.statusCode}\n body: ${rp}`
                    reject(out);
                }
            }
        });
    })
}

getToken = async (suite, user, tenant) => {
    var env = config.read();
    var url = env[suite].service.idm + "/idm-service/v2.0/tokens";
    var password = env[suite].login.idmTransportUser;
    var auth = getAuthorization('idmTransportUser', password);
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
    return await sendRequest(options, [200]);
    
}

getOrganizationList = async suite => {
    var env = config.read();
    var url = env[suite]['service']['idm'] + "/idm-service/api/scim/organizations";
    var data = await getToken(suite, env[suite].admin.user, env[suite].admin.tenant);
    var token = data.body.token.id;

    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Auth-Token": token,
            "Accept": "application/json"
        }
    };
    return await sendRequest(options, [200]);
}

getOrganizationDetails = async (suite, intOrgName) => {
    var url = env[suite]['service']['idm'] + `/idm-service/api/scim/organizations/${intOrgName}/configurations`;
    var token = await getToken(suite, env[suite].admin.user, env[suite].admin.tenant);
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "GET",
        headers: {
            "Accept": "application/json",
            "X-Auth-Token": token,
            "Accept": "application/json"
        }
    };

    return await sendRequest(options, [200]);
}



module.exports = {
    getAuthorization,
    getToken,
    getOrganizationList,
    getOrganizationDetails
}

