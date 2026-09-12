import express from 'express';
// eslint-disable-next-line import/extensions
import router from './routes/index.js';

const app = express();

app.use('/', router);
app.listen(1245);

export default app;
