require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const LISTEN_PORT = 4500;
//
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // app.disable('x-powered-by');
  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  app.use(helmet());
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.contentSecurityPolicy());

  await app.listen(process.env.PORT || LISTEN_PORT, () => {
    console.log(`HTTP server listening at ${process.env.PORT}`);
  });
}

bootstrap();
