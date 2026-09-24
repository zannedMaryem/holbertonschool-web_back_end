const express = require('express');
const fs = require('fs');

const app = express();

function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const lines = data.split('\n').filter((line) => line.trim() !== '');
      const students = lines.slice(1); // skip header
      const fields = {};

      students.forEach((line) => {
        const parts = line.split(',');
        const firstName = parts[0];
        const field = parts[3]; // CSV format: firstname,lastname,age,field
        if (firstName && field) {
          if (!fields[field]) fields[field] = [];
          fields[field].push(firstName);
        }
      });

      let output = `Number of students: ${students.length}\n`;
      for (const [field, list] of Object.entries(fields)) {
        output += `Number of students in ${field}: ${list.length}. List: ${list.join(', ')}\n`;
      }

      resolve(output.trim());
    });
  });
}

app.get('/', (req, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', (req, res) => {
  const database = process.argv[2];
  countStudents(database)
    .then((report) => {
      res.type('text/plain');
      res.send(`This is the list of our students\n${report}`);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.listen(1245);

module.exports = app;
