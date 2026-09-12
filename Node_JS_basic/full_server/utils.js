const fs = require('fs');

async function readDatabase(filePath) {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const headers = lines.shift().split(',');
    const firstnameIndex = headers.indexOf('firstname');
    const fieldIndex = headers.indexOf('field');

    const studentsByField = {};

    lines.forEach((line) => {
        const values = line.split(',');
        const field = values[fieldIndex];
        const firstname = values[firstnameIndex];

        if (!studentsByField[field]) {
            studentsByField[field] = [];
        }
        studentsByField[field].push(firstname);
    });

    return studentsByField;
}

module.exports = readDatabase;
