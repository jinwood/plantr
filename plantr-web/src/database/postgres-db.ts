import { createConnection, Repository, getManager } from 'typeorm';
import { postgresTables } from './postgres-tables';

export const postgresDB = async () => {
  return await createConnection({
    type: 'postgres',
    host: 'manny.db.elephantsql.com',
    port: 5432,
    username: 'mifrcxsi',
    password: 'KGuLyGkzivutpdTnBs2qA1U7Z7cMwKFr',
    database: 'mifrcxsi',
    ssl: true,
    entities: postgresTables,
    logging: ['query', 'error'],
    synchronize: true
  })
    .then(async connection => {
      console.log('connection to db established');
    })
    .catch(error => console.log(`db connection error occured ${error}`));
};
