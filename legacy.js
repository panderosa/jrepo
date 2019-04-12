const request = require('request');

function getLegacyAuth(suite,env) {
    return "Basic " + Buffer.from("csaTransportUser:" + env[suite]['login']['csaTransportUser']).toString('base64');
}

function getSubscriptionDetails(suite, env, catalogId, subscriptionId, userIdentifier) {
    var url = env[suite]['service']['legacy'] + `/catalog/${catalogId}/subscription/${subscriptionId}?userIdentifier=${userIdentifier}`;
    var auth = getLegacyAuth(suite,env);
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

    console.log("options => " + JSON.stringify(options));

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
                    var out = `status code: ${res.statusCode}\n \
body: ${rp}`
                    reject(out);
                }
            }
        });
    })
}

function getArtifact(suite, env, artifactId, userIdentifier) {
    var url = env[suite]['service']['legacy'] + `/artifact/${artifactId}?userIdentifier=${userIdentifier}`;
    var auth = getLegacyAuth(suite,env);
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": auth
        }
    };

    //console.log("options => " + JSON.stringify(options));

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
                    var out = `status code: ${res.statusCode}\n \
body: ${rp}`
                    reject(out);
                }
            }
        });
    })
}

module.exports = {
    getSubscriptionDetails,
    getArtifact
}