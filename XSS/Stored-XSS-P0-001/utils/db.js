const fs = require('fs');


function readJsonFile(filename) {
    try {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'))
    } catch(err) {
        console.error(`Erro: ${filename}`, err);
        return []
    }
}

function writeJsonFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch(err) {
        console.error(`Error writing to file: ${filename}`, err)
    }
}

module.exports = {readJsonFile, writeJsonFile};