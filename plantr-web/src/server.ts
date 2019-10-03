import bodyParser from 'koa-bodyparser';
import * as cors from 'koa2-cors';
import { postgresDB } from 'database/postgres-db';

const app = require('./app');

const bootsrap = async () => {
  await postgresDB();
  app.use(cors.default({ origin: 'http://localhost:3000' }));
  app.use(bodyParser());
  app.listen(4000);
};
