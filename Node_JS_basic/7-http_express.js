const express = require('express');
const fs = require('fs');

const databasePath = process.argv[2];
const app = express();

const getStudentsReport = async () => {
    const data = await fs.promises.readFile(databasePath, 'utf8');
    const lines = data.split(/\r?\n/).filter((line) => line.trim() !== '');
    const headers = lines[0].split(',');
    const fieldIndex = headers.indexOf('field');
    const firstNameIndex = headers.indexOf('firstname');
    const studentsByField = {};

    lines.slice(1).forEach((line) => {
        const student = line.split(',');
        const field = student[fieldIndex];
        const firstName = student[firstNameIndex];

        if (!studentsByField[field]) {
            studentsByField[field] = [];
        }
        studentsByField[field].push(firstName);
    });

    const report = [`Number of students: ${lines.length - 1}`];
    Object.keys(studentsByField).forEach((field) => {
        const students = studentsByField[field];
        report.push(`Number of students in ${field}: ${students.length}. List: ${students.join(', ')}`);
    });

    return report.join('\n');
};

app.get('/', (request, response) => {
    response.type('text/plain').send('Hello Holberton School!');
});

app.get('/students', async (request, response) => {
    try {
        const report = await getStudentsReport();
        response.type('text/plain').send(`This is the list of our students\n${report}`);
    } catch (error) {
        response.type('text/plain').send('Cannot load the database');
    }
});

app.listen(1245);

module.exports = app;
