import { Logger } from '@nestjs/common';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { defineConfig } from '@mikro-orm/postgresql';
import User from 'src/user/entities/user.entity';
import { Migrator } from '@mikro-orm/migrations'; // or `@mikro-orm/migrations-mongodb`

const logger = new Logger('MikroORM');

const ssl = process.env.DATABASE_SSL === 'true';
export default defineConfig({
  entities:
    process.env.NODE_ENV === 'development'
      ? ['dist/**/*.entity.js']
      : ['./src/**/*.entity.js'],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  highlighter: new SqlHighlighter(),
  debug: true,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logger: logger.log.bind(logger),
  driverOptions: {
    connection: {
      ssl,
    },
  },
  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
    transactional: true,
    allOrNothing: true,
  },
  extensions: [Migrator],
});
