const request = require('request');

function filter(suite, env, token, status, onBehalf) {
    var url = env[suite]['service']['api'] + "/mpp/mpp-subscription/filter";
    url = (onBehalf) ? url + "/?onBehalf=" + onBehalf : url;
    var status = (status) ? status: null;
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "POST",
        headers: {
            "Accept": "application/json",
            "X-Auth-Token": token
        },
        json: true,
        body: {
            "status": status,
            "category": null,
            "name": null,
            "healthStatus": null
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

function remove(suite, env, token, list, onBehalf) {
    var url = env[suite]['service']['api'] + "/mpp/mpp-subscription";
    url = (onBehalf) ? url + "/?onBehalf=" + onBehalf : url;
    var status = (status) ? status: null;
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "POST",
        headers: {
            "Accept": "application/json",
            "X-Auth-Token": token
        },
        json: true,
        body: {
            id: list
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

function cancelMultiple(suite, env, auth, list) {
    return Promise.all(list.map(i => cancelOne(suite, env, auth, i)));
}


function cancelOne(suite, env, auth, subscriptionId) {
    var url = env[suite]['service']['api'] + `/service/subscription/${subscriptionId}/cancel`;
    var options = {
        url: url,
        rejectUnauthorized: false,
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": auth
        },
        json: true,
        body: {}
    };
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (!err && (res.statusCode === 200 || res.statusCode === 201)) {
                resolve(res.statusCode);
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

function getDetails(suite, env, auth, subscriptionId) {
    var url = env[suite]['service']['api'] + `/service/subscription/details/${subscriptionId}`;
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
    filter,
    cancelOne,
    cancelMultiple,
    getDetails,
    remove
}
