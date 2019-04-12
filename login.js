let request = require('request');
// ${CSA_REST_URI}/catalog/${catalogId}/request/${requestId}?userIdentifier=${userContextId}

function getLegacyAuth(suite,env) {
    return "Basic " + Buffer.from("csaTransportUser:" + env[suite]['login']['csaTransportUser']).toString('base64');
}


function getIdentifier(suite, env, org, userName) {
    var url = env[suite]['service']['legacy'] + `/login/${org}/${userName}`;
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

    //console.log("options => " + JSON.stringify(options));

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (!err && (res.statusCode === 200 || res.statusCode === 201)) {
                resolve(body.id);
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
    getIdentifier
}