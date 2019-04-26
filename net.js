const request = require('request');
const https = require('https');
const fs = require('fs');
const Stream = require('stream').Transform;

sendRequest = async (options) => {
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (!err && (res.statusCode === 200 || res.statusCode === 201)) {
                var output = {
                    body: body,
                    headers: res.headers
                };
                resolve(output);
            }
            else {
                if (err) {
                    reject(err);
                }
                else {
                    var rp = JSON.stringify(res.body);
                    var out = `status code: ${res.statusCode}\n body: ${rp}`;
                    reject(out);
                }
            }
        });
    })
}

downloadFile = async (url) => {

    var options = {
        url: url,
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            var data = fs.createWriteStream('c:/tmp/lala.jpg','binary');

            res.on('data', (chunk) => {
                data.pipe
            });

            res.on('end', () => {
                resolve(data);
            });

        }).on('error', (err) => {
            reject(err);
        });

    })

};

main = async () => {
    try {
    var data = await downloadFile('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Nebukadnessar_II.jpg/237px-Nebukadnessar_II.jpg');
    console.log('completed');
    //fs.writeFileSync('c:/tmp/lala.jpg', data); 
    }
    catch(error) {
        console.log(error);
    }
};

main();

module.exports = {
    sendRequest
}