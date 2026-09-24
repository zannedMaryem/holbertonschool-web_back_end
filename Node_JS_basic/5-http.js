const http = require('http');
const fs = require('fs');

// Function to read database asynchronously (similar to 3-read_file_async.js)
function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const lines = data.split('\n').filter((line) => line.trim() !== '');
      if (lines.length <= 1) {
        resolve('Number of students: 0');
        return;
      }

      const headers = lines[0].split(',');
      const fieldIndex = headers.indexOf('field');
      const firstNameIndex = headers.indexOf('firstname');
      const studentsByField = {};

      lines.slice(1).forEach((line) => {
        const student = line.split(',');
        const field = student[fieldIndex];
        const firstName = student[firstNameIndex];

        if (field && firstName) {
          if (!studentsByField[field]) {
            studentsByField[field] = [];
          }
          studentsByField[field].push(firstName);
        }
      });

      let output = `Number of students: ${lines.length - 1}\n`;
      Object.keys(studentsByField).forEach((field) => {
        const students = studentsByField[field];
        output += `Number of students in ${field}: ${students.length}. List: ${students.join(', ')}\n`;
      });

      resolve(output.trim());
    });
  });
}

// Create HTTP server
const app = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/') {
    res.statusCode = 200;
    res.end('Hello Holberton School!');
  } else if (req.url === '/students') {
    const database = process.argv[2];
    if (!database) {
      res.statusCode = 500;
      res.end('Cannot load the database');
      return;
    }

    countStudents(database)
      .then((report) => {
        res.statusCode = 200;
        res.end(`This is the list of our students\n${report}`);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.end(err.message);
      });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// Listen on port 1245
app.listen(1245);

module.exports = app;
