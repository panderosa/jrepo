let request = require('request');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');

function getAuthorization(user, password) {
    return "Basic " + Buffer.from(user + ":" + password).toString('base64');
}

async function sendRequest(options, goodStatuses) {
    var goodStatuses = goodStatuses || [200];
    return new Promise(function (resolve, reject) {
        request(options, (err, res) => {
            if (!err && goodStatuses.includes(res.statusCode)) {
                resolve(res.body);
            }
            else {
                var failure = {
                    error: err,
                    message: res.body || null,
                    headers: res.headers || null,
                    code: res.statusCode || null
                }
                reject(failure);
            }
        });
    })
}

async function getToken(suite, user, tenant) {
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
    var resp = await sendRequest(options, [200]);
    return resp;
}

async function getOrganizationList(suite) {
    var env = config.read();
    var url = env[suite]['service']['idm'] + "/idm-service/api/scim/organizations";
    var data = await getToken(suite, env[suite].admin.user, env[suite].admin.tenant);
    var token = data.token.id;

    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "GET",
        json: true,
        headers: {
            "Accept": "application/json",
            "X-Auth-Token": token,
            "Accept": "application/json"
        }
    };
    return await sendRequest(options, [200]);
}

async function getOrganizationDetails(suite, intOrgName) {
    var env = config.read();
    var url = env[suite]['service']['idm'] + `/idm-service/api/scim/organizations/${intOrgName}/configurations`;
    var data = await getToken(suite, env[suite].admin.user, env[suite].admin.tenant);
    var token = data.token.id;
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "GET",
        json: true,
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

