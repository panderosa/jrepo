const fs = require('fs');

var description = "Javascript for selection list";
var fileName = 'ada.js';
var content = fs.readFileSync('c:/tmp/input.js');

var payload = formMultipart(fileName,content)

console.log(payload);

function formMultipart(fileName,content) {
    var boundary = '==123456789JOJO==';

    var body = `--${boundary}
Content-Disposition: form-data; name=\"file\"; filename=\"${fileName}\"
Content-Type: text/plain
    
    
${content}
    
--${boundary}--
`;
    
    return body;
}




