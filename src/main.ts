import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { getConnection } from 'typeorm';
import { json } from 'express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import * as requestIp from 'request-ip';

import { Database, Resource } from '@admin-bro/typeorm';

const AdminBroExpress = require('@admin-bro/express');
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
import { Shop } from './apis/shop/entities/shop.entity';

import { SubCategory } from './apis/subCategory/entities/subCategory.entity';
import { TopCategory } from './apis/topCategory/entities/topCategory.entity';
import * as bcrypt from 'bcrypt';
import { Place } from './apis/place/entities/place.entity';
import { BoardLike } from './apis/boardLike/entities/boardLike.entity';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.use(json());
  app.use(requestIp.mw());
  AdminBro.registerAdapter({ Database, Resource });

  const adminBro = new AdminBro({
    resources: [
      Board,
      BoardLike,
      BoardSide,
      BoardTag,
      Comment,
      CommentLike,
      Message,
      MessageInfo,
      Notice,
      PaymentHistory,
      Shop,
      Place,
      SubCategory,
      TopCategory,
      User,
    ],
    rootPath: '/admin',
  });

  const router = AdminBroExpress.buildAuthenticatedRouter(
    adminBro,
    {
      cookieName: 'adminBro',
      cookiePassword: 'session Key',
      authenticate: async (email, password) => {
        const user = await getConnection()
          .createQueryBuilder()
          .select('user')
          .from(User, 'user')
          .where({ userEmail: email })
          .getOne();

        if (!user || user.userState === false) {
          return false;
        } else {
          const isAuth = await bcrypt.compare(password, user.userPassword);
          if (isAuth) {
            return user;
          }
        }
      },
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
    },
  );

  app.use(adminBro.options.rootPath, router);

  app.use(cookieParser());

  app.use(rateLimit({ windowMs: 5 * 60 * 1000, max: 100 }));

  app.enableCors({
    origin: [
      process.env.CORS_ORIGIN_DEV,
      process.env.CORS_ORIGIN_TEST,
      process.env.CORS_ORIGIN_PROD,
    ],
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
