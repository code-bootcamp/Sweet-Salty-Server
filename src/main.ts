import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { graphqlUploadExpress } from 'graphql-upload';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import Helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import * as requestIp from 'request-ip';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.use(json());
  // 파일 업로드 라이브러리
  app.use(graphqlUploadExpress());
  app.use(requestIp.mw());

  /// 사이트 간 위조 요청 방지 라이브러리
  // app.use(csurf());

  // http 통신 보안 라이브러리
  // contentSecurityPolicy : XSS 공격 방지 및 데이터 삽입 공격 방지 옵션
  // hidePoweredBy : 웹서버가 무엇으로 개발이 되었는지 숨기는 옵션
  // app.use(
  //   Helmet({
  //     contentSecurityPolicy: {
  //       reportOnly: true,
  //     },
  //     hidePoweredBy: true,
  //   }),
  // );

  // 과부화 방지 라이브러리
  app.use(rateLimit({ windowMs: 5 * 60 * 1000, max: 100 }));

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5501'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Authorization',
      'X-Requested-With',
      'Content-Type',
      'Accept',
    ],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
