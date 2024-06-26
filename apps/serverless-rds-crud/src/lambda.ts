import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import * as express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', reason => {
  console.error(reason);
});

process.on('uncaughtException', reason => {
  console.error(reason);
});
console.log('process', process.env);

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    try {
      const expressApp = express();
      const nestApp = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        {
          cors: true,
          logger: ['error', 'warn'],
        },
      );
      nestApp.use(eventContext());
      nestApp.use(helmet());
      nestApp.use(helmet.noSniff());
      nestApp.use(helmet.hidePoweredBy());
      nestApp.use(helmet.contentSecurityPolicy());
      await nestApp.init();
      cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.resolve(cachedServer);
}

export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
