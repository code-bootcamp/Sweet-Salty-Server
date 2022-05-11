import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    //
    origin: true,
    credentials: true,

    // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    // allowedHeaders: [
    //   'access-control-allow-origin',
    //   'X-Requested-With',
    //   'Content-Type',
    //   'Accept',
    // ],

    // maxAge: 3600,
    // optionsSuccessStatus: 204,
  });
  app.useStaticAssets(join(__dirname, '..', 'static'));

  await app.listen(3000);
}
bootstrap();
