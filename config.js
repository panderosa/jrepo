const configFile = "C:/Projects/HCM/configuration.json";
const fs = require('fs');
const read = () => JSON.parse(fs.readFileSync(configFile));

module.exports = {
    read
}