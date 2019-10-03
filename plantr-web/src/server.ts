import bodyParser from 'koa-bodyparser';
import * as cors from 'koa2-cors';
import { postgresDB } from 'database/postgres-db';
import { router } from 'routes';

const app = require('./app');

const bootsrap = async () => {
  await postgresDB();
  app.use(cors.default({ origin: 'http://localhost:3000' }));
  app.use(bodyParser());
  app.use(router.routes(), router.allowedMethods());
  app.listen(4000);
};

bootsrap();
