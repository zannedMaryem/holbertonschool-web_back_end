# Learning Node.js

Node.js is a JavaScript runtime built on Chrome's V8 engine. It lets us run
JavaScript outside the browser, so we can write command-line tools, web
servers, APIs, scripts, and background jobs with JavaScript.

This guide moves from the Node.js fundamentals to a small Express application.
The examples use CommonJS first because it is the module format used by many
Node.js projects. An ES6/Babel section later shows how to use modern `import`
and `export` syntax.

## Learning objectives

By the end of this guide, you should be able to:

- run JavaScript with Node.js;
- split an application into Node.js modules;
- read files with Node's `fs` module;
- use `process` for command-line arguments and environment variables;
- create an HTTP server with Node's built-in modules;
- create an HTTP server with Express.js;
- build parameterized and grouped Express routes;
- run ES6 JavaScript with `babel-node`;
- use Nodemon to restart a development server automatically.

## 1. Prerequisites and installation

Install the current LTS version of Node.js from [nodejs.org](https://nodejs.org/).
Installing Node.js also installs `npm`, the Node package manager.

Check the installation:

```bash
node --version       # Prints the Node.js version.
npm --version        # Prints the npm version.
```

Create a project and initialize its `package.json` file:

```bash
mkdir node-learning
cd node-learning
npm init -y           # Creates package.json with default values.
```

`package.json` describes the project, its scripts, and its dependencies. Keep
`package-lock.json` in version control so installations use reproducible
dependency versions.

## 2. Run JavaScript using Node.js

Create `hello.js`:

```js
// console.log writes text to the terminal.
console.log('Hello from Node.js');

// Node can use normal JavaScript values and functions.
const add = (firstNumber, secondNumber) => firstNumber + secondNumber;
console.log(add(2, 3));
```

Run the file with the `node` executable:

```bash
node hello.js
```

Node also has a REPL (Read-Eval-Print Loop) for trying short expressions:

```bash
node
> 2 + 3
5
> .exit
```

Useful facts:

- Node executes JavaScript on the server or in a terminal, not in a browser.
- Browser globals such as `window` and `document` are not available by default.
- Node provides useful globals such as `console`, `process`, `__dirname`, and
 `__filename` in CommonJS files.
- JavaScript runs on a single main event loop. Asynchronous I/O lets Node serve
 other work while it waits for a file, network, or database operation.

## 3. Use Node.js modules

A module is a file whose values are kept private unless they are exported.
Exporting and importing values makes code easier to test and maintain.

### Export a value with CommonJS

Create `math.js`:

```js
// These functions are private until they are assigned to module.exports.
const add = (firstNumber, secondNumber) => firstNumber + secondNumber;
const multiply = (firstNumber, secondNumber) => firstNumber * secondNumber;

// Export an object containing the public API of this module.
module.exports = { add, multiply };
```

Create `use-math.js`:

```js
// require loads the object exported by math.js.
const { add, multiply } = require('./math');

console.log(add(2, 3));
console.log(multiply(2, 3));
```

Run it:

```bash
node use-math.js
```

### Built-in, local, and third-party modules

Node resolves modules in three common ways:

```js
const path = require('node:path'); // Built-in Node.js module.
const math = require('./math');     // Local file; ./ is important.
const express = require('express'); // Installed dependency in node_modules.
```

Install a third-party module locally instead of relying on a global install:

```bash
npm install express
```

Use `node:` for built-in modules when possible. It makes it clear that the
module comes from Node itself and cannot be shadowed by a package with the same
name.

## 4. Read files with the `fs` module

The `node:fs` module provides file-system operations. Prefer the promise API
for new asynchronous code because it works naturally with `async` and `await`.

Create `notes.txt`:

```text
Node.js makes JavaScript useful outside the browser.
```

Create `read-file.js`:

```js
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const readNotes = async () => {
 // __dirname keeps the path correct even when the command runs elsewhere.
 const filePath = path.join(__dirname, 'notes.txt');

 try {
  // utf8 returns a string. Without it, readFile returns a Buffer.
  const contents = await readFile(filePath, 'utf8');
  console.log(contents);
 } catch (error) {
  // Always handle expected I/O failures, such as a missing file.
  console.error(`Could not read ${filePath}: ${error.message}`);
  process.exitCode = 1;
 }
};

readNotes();
```

Run it with `node read-file.js`.

### Synchronous versus asynchronous file access

Synchronous operations block the event loop until they finish. They can be
acceptable for a short startup script, but avoid them in a server request
handler.

```js
const { readFileSync } = require('node:fs');

// This call blocks all other JavaScript until the file has been read.
const contents = readFileSync('notes.txt', 'utf8');
console.log(contents);
```

Use asynchronous methods such as `readFile`, `writeFile`, and `mkdir` in
long-running applications.

## 5. Use `process` for arguments and environment variables

`process` describes and controls the current Node.js process.

### Command-line arguments

`process.argv` is an array. The first item is the Node executable, the second is
the script path, and the remaining items are arguments supplied by the user.

Create `greet.js`:

```js
// node greet.js Ada -> process.argv contains "Ada" after the first two items.
const name = process.argv[2] || 'developer';

console.log(`Hello, ${name}!`);
```

Run it:

```bash
node greet.js Ada
```

For complex command-line interfaces, use a package such as `yargs` or
`commander` instead of manually parsing many array positions.

### Environment variables

Environment variables configure an application without putting machine-specific
values in source code:

```js
const port = Number(process.env.PORT) || 3000;
const mode = process.env.NODE_ENV || 'development';

console.log(`Starting in ${mode} mode on port ${port}`);
```

Set variables before starting the process:

```bash
PORT=8080 NODE_ENV=production node server.js
```

On Windows PowerShell, use:

```powershell
$env:PORT=8080; $env:NODE_ENV="production"; node server.js
```

Do not commit secrets such as passwords or API keys. A `.env` file can be
loaded by a package such as `dotenv`, but it should be listed in `.gitignore`.

Other useful `process` APIs:

```js
console.log(process.cwd());       // Directory where Node was started.
console.log(process.platform);    // Operating system identifier.
console.log(process.version);     // Node.js version.
process.exitCode = 1;             // Finish with a failure status gracefully.
```

## 6. Create an HTTP server with Node.js

The built-in `node:http` module can create a server without extra
dependencies. Create `http-server.js`:

```js
const http = require('node:http');

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((request, response) => {
 // request.method and request.url identify the incoming HTTP request.
 if (request.method === 'GET' && request.url === '/') {
  response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Welcome to the Node.js server');
  return;
 }

 if (request.method === 'GET' && request.url === '/health') {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ status: 'ok' }));
  return;
 }

 // Return a clear response for every route that was not recognized.
 response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
 response.end('Not found');
});

server.listen(port, () => {
 console.log(`Server running at http://localhost:${port}`);
});
```

Start it and test it from another terminal:

```bash
node http-server.js
curl http://localhost:3000/
curl http://localhost:3000/health
```

Important HTTP concepts:

- `GET` reads data; `POST` creates data; `PUT` or `PATCH` updates data; and
 `DELETE` removes data.
- Status `2xx` means success, `4xx` means a client error, and `5xx` means a
 server error.
- Headers describe the response, including its content type.
- Call `response.end()` exactly once for each request.
- A real application needs routing, input validation, logging, and error
 handling. Express provides convenient tools for these concerns.

Stop the server with `Ctrl+C`.

## 7. Create an HTTP server with Express.js

Express is a small web framework built on Node's HTTP capabilities. It
simplifies routing and middleware.

Install it:

```bash
npm install express
```

Create `express-server.js`:

```js
const express = require('express');

const app = express();
const port = Number(process.env.PORT) || 3000;

// Parse JSON request bodies before route handlers run.
app.use(express.json());

app.get('/', (request, response) => {
 response.send('Welcome to Express');
});

app.get('/health', (request, response) => {
 response.json({ status: 'ok' });
});

app.listen(port, () => {
 console.log(`Express server running at http://localhost:${port}`);
});
```

Start it with `node express-server.js`. Express sets common headers and ends
the response when `send` or `json` is called.

### Middleware

Middleware receives the request, the response, and a `next` function. It can
run code, change the request or response, end the request, or pass control on.

```js
app.use((request, response, next) => {
 // This runs before every route registered after this middleware.
 console.log(`${request.method} ${request.originalUrl}`);
 next();
});
```

Call `next(error)` when an operation fails so the error middleware can handle
it. Do not call `next()` after already sending a response.

## 8. Advanced Express routes

Routes can use parameters, query strings, routers, and different HTTP methods.

### Route parameters and query strings

```js
const books = [
 { id: 1, title: 'Node Basics' },
 { id: 2, title: 'Express Patterns' },
];

// :id is a required path parameter, available as request.params.id.
app.get('/books/:id', (request, response) => {
 const book = books.find((item) => item.id === Number(request.params.id));

 if (!book) {
  response.status(404).json({ error: 'Book not found' });
  return;
 }

 response.json(book);
});

// /books?title=node provides request.query.title.
app.get('/books', (request, response) => {
 const search = String(request.query.title || '').toLowerCase();
 const result = search
  ? books.filter((book) => book.title.toLowerCase().includes(search))
  : books;

 response.json(result);
});
```

Always validate and normalize URL parameters and query values. Never trust
client input just because it came from a route that looks correct.

### POST routes and request bodies

```js
app.post('/books', (request, response) => {
 const { title } = request.body;

 if (typeof title !== 'string' || title.trim() === '') {
  response.status(400).json({ error: 'title is required' });
  return;
 }

 const book = { id: books.length + 1, title: title.trim() };
 books.push(book);
 response.status(201).json(book);
});
```

Test it with:

```bash
curl -X POST http://localhost:3000/books \
 -H 'Content-Type: application/json' \
 -d '{"title":"Learning Node"}'
```

### Routers

Routers group related routes into a separate module. Create `routes/books.js`:

```js
const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
 response.json({ books: [] });
});

router.get('/:id', (request, response) => {
 response.json({ id: request.params.id });
});

module.exports = router;
```

Mount the router from the application entry point:

```js
const booksRouter = require('./routes/books');

// The router's / route is available as /api/books.
app.use('/api/books', booksRouter);
```

### Error-handling middleware

Error middleware has four parameters. Put it after the routes:

```js
app.use((error, request, response, next) => {
 // Avoid exposing stack traces in production responses.
 console.error(error);
 response.status(error.statusCode || 500).json({
  error: 'Internal server error',
 });
});
```

The `next` parameter is required in the function signature so Express knows
that this is error-handling middleware, even if the function does not use it.

For production applications, also add authentication and authorization where
needed, security headers, rate limiting, CORS rules, request-size limits,
structured logging, and automated tests.

## 9. Use ES6 with Node.js and `babel-node`

Recent Node.js versions support many modern JavaScript features directly. Babel
is useful when a project needs syntax transformation or a consistent toolchain.
`babel-node` runs a file after applying the Babel configuration, which is handy
for development but should generally be replaced by a build step in
production.

Install the development dependencies:

```bash
npm install --save-dev @babel/core @babel/node @babel/preset-env
```

Create `babel.config.json`:

```json
{
 "presets": [
  ["@babel/preset-env", { "targets": { "node": "current" } }]
 ]
}
```

Create `constants.js`:

```js
// ES6 named export.
export const appName = 'Node learning project';
```

Create `babel-example.js`:

```js
import { appName } from './constants.js';

// This uses an ES6 import and a template literal.
const describe = (name = 'developer') => `${appName}: hello ${name}`;

console.log(describe('Ada'));
```

Run it with:

```bash
npx babel-node babel-example.js
```

In a real project, add a script instead of typing the command repeatedly:

```json
{
 "scripts": {
  "babel:start": "babel-node babel-example.js"
 }
}
```

Then run `npm run babel:start`. For a production build, use Babel CLI to write
transformed files to a directory and run the generated JavaScript with `node`.

## 10. Use Nodemon for faster development

Nodemon watches project files and restarts the Node process when a file changes.
Install it as a development dependency:

```bash
npm install --save-dev nodemon
```

Add a script to `package.json`:

```json
{
 "scripts": {
  "start": "node express-server.js",
  "dev": "nodemon express-server.js"
 }
}
```

Run the development server with:

```bash
npm run dev
```

Nodemon is a development convenience. It should not be used as the process
manager for a production deployment; use the hosting platform's process
manager or a tool such as PM2 where appropriate.

## 11. Useful Node.js habits

### Keep configuration outside source code

Use environment variables for ports, database URLs, and secrets. Validate
required configuration at startup so a broken deployment fails clearly.

### Prefer asynchronous I/O

Do not use synchronous file or network operations inside request handlers. A
blocked event loop prevents the process from handling other requests.

### Handle errors deliberately

Use `try/catch` around awaited operations, handle rejected promises, and return
an appropriate HTTP status. Log enough context to diagnose a failure without
leaking secrets or personal data.

### Validate external input

Validate route parameters, query strings, request bodies, headers, and uploaded
files. Validation is needed for correctness and security, not just for nicer
error messages.

### Use a clear project structure

A small Express project might grow into this structure:

```text
node-learning/
├── src/
│   ├── app.js          # Creates the Express application.
│   ├── server.js       # Starts listening on a port.
│   ├── routes/         # Groups HTTP routes.
│   ├── controllers/    # Handles request/response behavior.
│   └── services/       # Contains reusable business logic.
├── test/               # Automated tests.
├── .env                # Local secrets; do not commit this file.
├── .gitignore
├── package.json
└── package-lock.json
```

Keep `app.js` separate from `server.js` so tests can import the application
without opening a network port.

### Helpful npm commands

```bash
npm install                 # Install package.json dependencies.
npm install package-name    # Add a runtime dependency.
npm install -D package-name # Add a development dependency.
npm uninstall package-name  # Remove a dependency.
npm outdated                # Check for newer dependency versions.
npm audit                   # Check known dependency vulnerabilities.
npm run <script>            # Run a script from package.json.
```

## 12. Suggested practice project

Build a small books API with these endpoints:

```text
GET    /api/books       List books, optionally filtered by ?title=...
GET    /api/books/:id   Read one book
POST   /api/books       Create a book from a JSON body
PATCH  /api/books/:id   Update selected fields
DELETE /api/books/:id   Delete a book
GET    /health          Return an application health check
```

Add validation, a router, a centralized error handler, environment-based port
configuration, and tests for successful and failing requests. Start with an
in-memory array, then replace it with a database only after the HTTP behavior
is clear.

## Summary

Node.js provides the runtime, built-in modules such as `fs` and `http` provide
core capabilities, and Express adds convenient routing and middleware. `process`
connects an application to its environment, Babel supports a modern syntax
workflow, and Nodemon makes local development faster. The most important habits
are to keep I/O asynchronous, validate inputs, handle errors, protect secrets,
and keep application code separated into small modules.
