// eslint-disable-next-line import/extensions
import readDatabase from '../utils.js';

export default class StudentsController {
    static async getAllStudents(request, response) {
        try {
            const studentsByField = await readDatabase(process.argv[2]);
            const fields = Object.keys(studentsByField).sort((firstField, secondField) => (
                firstField.toLowerCase().localeCompare(secondField.toLowerCase())
            ));
            const lines = ['This is the list of our students'];

            fields.forEach((field) => {
                const firstnames = studentsByField[field];
                lines.push(`Number of students in ${field}: ${firstnames.length}. List: ${firstnames.join(', ')}`);
            });

            return response.status(200).send(lines.join('\n'));
        } catch (error) {
            return response.status(500).send('Cannot load the database');
        }
    }

    static async getAllStudentsByMajor(request, response) {
        const { major } = request.query;

        if (major !== 'CS' && major !== 'SWE') {
            return response.status(500).send('Major parameter must be CS or SWE');
        }

        try {
            const studentsByField = await readDatabase(process.argv[2]);
            return response.status(200).send(`List: ${studentsByField[major].join(', ')}`);
        } catch (error) {
            return response.status(500).send('Cannot load the database');
        }
    }
}
