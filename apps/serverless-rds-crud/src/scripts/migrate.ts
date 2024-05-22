import { DatabaseDriver, MikroORM } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

(async () => {
  const ssl = process.env.DATABASE_SSL === 'true';

  const orm = await MikroORM.init({
    extensions: [Migrator],
    dbName: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    driver: PostgreSqlDriver,
    entities:
      process.env.NODE_ENV === 'development'
        ? ['./dist/**/*.entity.js']
        : ['./src/**/*.entity.js'],
    driverOptions: {
      connection: {
        ssl,
      },
    },
    migrations: {
      path: 'dist/database/migrations',
      pathTs: './src/database/migrations',
      transactional: true,
      allOrNothing: true,
    },
  });

  const migrator = orm.getMigrator();
  await migrator.createMigration(); // creates file Migration20191019195930.ts
  await migrator.up(); // runs migrations up to the latest

  await orm.close(true);
})();
