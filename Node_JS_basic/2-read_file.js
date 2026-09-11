const fs = require('fs');

function countStudents(filePath) {
  let data;

  try {
    data = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error('Cannot load the database');
  }

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

  console.log(`Number of students: ${lines.length - 1}`);
  Object.keys(studentsByField).forEach((field) => {
    const students = studentsByField[field];
    console.log(`Number of students in ${field}: ${students.length}. List: ${students.join(', ')}`);
  });
}

module.exports = countStudents;
