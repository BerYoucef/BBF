const path = require('path');
const {readJsonFile, writeJsonFile} = require('../utils/db');

const db_path = path.join(__dirname, "..", "db_products.json");

function readDB() {
    return readJsonFile(db_path);
}

function writeDB(data) {
    writeJsonFile(db_path, data);
}


module.exports = {readDB, writeDB}

