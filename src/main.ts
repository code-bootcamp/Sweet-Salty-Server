import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { getConnection } from 'typeorm';
import { json } from 'express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import Helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import * as requestIp from 'request-ip';

import { Database, Resource } from '@admin-bro/typeorm';
import AdminBroExpress from '@admin-bro/express';
import AdminBro from 'admin-bro';

import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { User } from './apis/user/entities/user.entity';
import { Notice } from './apis/notice/entities/notice.entity';
import { Board } from './apis/board/entities/board.entity';
import { Comment } from './apis/comment/entities/comment.entity';
import { BoardSide } from './apis/boardSide/entities/boardSide.entity';
import { BoardTag } from './apis/boardTag/entities/boardTag.entity';
import { CommentLike } from './apis/commentLike/entities/commentLike.entity';
import { Message } from './apis/message/entitis/message.entity';
import { MessageInfo } from './apis/messageInfo/entities/messageInfo.entity';
import { PaymentHistory } from './apis/paymentHistory/entities/paymentHistory.entity';
import { PaymentShopHistory } from './apis/paymentShopHistory/entities/paymentShopHistory.entity';
import { Shop } from './apis/shop/entities/shop.entity';

import { SubCategory } from './apis/subCategory/entities/subCategory.entity';
import { TopCategory } from './apis/topCategory/entities/topCategory.entity';
import * as bcrypt from 'bcrypt';
import { Place } from './apis/place/entities/place.entity';
import { SocketIoAdapter } from './adapters/socket-io.adapters';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());
  // 추가
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  //
  app.use(json());
  app.use(requestIp.mw());
  // AdminBro.registerAdapter({ Database, Resource });

  // const adminBro = new AdminBro({
  //   resources: [
  //     Board,
  //     BoardSide,
  //     BoardTag,
  //     Comment,
  //     CommentLike,
  //     Message,
  //     MessageInfo,
  //     Notice,
  //     PaymentHistory,
  //     PaymentShopHistory,
  //     Shop,
  //     Place,
  //     SubCategory,
  //     TopCategory,
  //     User,
  //   ],
  //   rootPath: '/admin',
  // });

  // // 잠시주석
  // const router = AdminBroExpress.buildAuthenticatedRouter(
  //   adminBro,
  //   {
  //     cookieName: 'adminBro',
  //     cookiePassword: 'session Key',
  //     authenticate: async (email, password) => {
  //       const user = await getConnection()
  //         .createQueryBuilder()
  //         .select('user')
  //         .from(User, 'user')
  //         .where({ userEmail: email })
  //         .getOne();

  //       if (!user || user.userState === false) {
  //         return false;
  //       } else {
  //         const isAuth = await bcrypt.compare(password, user.userPassword);
  //         if (isAuth) {
  //           return user;
  //         }
  //       }
  //     },
  //   },
  //   null,
  //   {
  //     // 추가
  //     resave: false, // 추가
  //     saveUninitialized: true, // 추가
  //   },
  // );

  // app.use(adminBro.options.rootPath, router);
  // 여기까지

  //Nest.js AdminBro 연결

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

//////

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);
//   app.useStaticAssets(join(__dirname, '..', 'static'));
//   app.use(json());
//   // 파일 업로드 라이브러리

//   app.use(requestIp.mw());
//   AdminBro.registerAdapter({ Database, Resource });

//   const adminBro = new AdminBro({
//     resources: [
//       Board,
//       BoardSide,
//       BoardTag,
//       Comment,
//       CommentLike,
//       Message,
//       MessageInfo,
//       Notice,
//       PaymentHistory,
//       PaymentShopHistory,
//       Shop,
//       Store,
//       SubCategory,
//       TopCategory,
//       User,
//     ],
//     rootPath: '/admin',
//   });

//   const router = AdminBroExpress.buildRouter(adminBro);

//   app.use(graphqlUploadExpress());

//   // const router = AdminBroExpress.default.buildRouter(new AdminBro());
//   app.use(adminBro.options.rootPath, router);
//   // Nest.js AdminBro 연결

//   /// 사이트 간 위조 요청 방지 라이브러리
//   // app.use(csurf());

//   // http 통신 보안 라이브러리
//   // contentSecurityPolicy : XSS 공격 방지 및 데이터 삽입 공격 방지 옵션
//   // hidePoweredBy : 웹서버가 무엇으로 개발이 되었는지 숨기는 옵션
//   // app.use(
//   //   Helmet({
//   //     contentSecurityPolicy: {
//   //       reportOnly: true,
//   //     },
//   //     hidePoweredBy: true,
//   //   }),
//   // );

//   // 과부화 방지 라이브러리
//   app.use(rateLimit({ windowMs: 5 * 60 * 1000, max: 100 }));

//   app.use(cookieParser());
//   app.enableCors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     allowedHeaders: [
//       'Access-Control-Allow-Headers',
//       'Authorization',
//       'X-Requested-With',
//       'Content-Type',
//       'Accept',
//     ],
//     credentials: true,
//   });

//   await app.listen(3000);
// }
// bootstrap();
