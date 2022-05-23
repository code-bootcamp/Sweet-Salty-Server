import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import { Connection } from 'typeorm';
import { UserModule } from './apis/user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './apis/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { BoardModule } from './apis/board/board.module';
import { CommentModule } from './apis/comment/comment.module';
import { CommentLikeModule } from './apis/commentLike/commentLike.module';
import { BoardLikeModule } from './apis/boardLike/boardLike.module';
import { PointTransactionModule } from './apis/pointTransaction/pointTransaction.module';
import { MessageModule } from './apis/message/message.module';
import { ShopModule } from './apis/shop/shop.module';
import { AdminModule } from './apis/admin/admin.module';
import { NoticeModule } from './apis/notice/notice.module';
import { graphqlUploadExpress } from 'graphql-upload';
<<<<<<< HEAD
<<<<<<< HEAD
import { RealTimeModule } from './apis/realTime/realTime.module';
import { ImageModule } from './apis/image/image.module';
=======
import { ChatBackEndModule } from './chatBackEnd/chatBackEnd.module';
import { ChatFrontEndModule } from './chatFrontEnd/chatFrontEnd.module';
>>>>>>> dc8f6e13e3e6a31c802e3b463a5873197f6e14cf
=======
import { RealTimeModule } from './apis/realTime/realTime.module';
import { ImageModule } from './apis/image/image.module';
import { ChatBackEndModule } from './chatBackEnd/chatBackEnd.module';
import { ChatFrontEndModule } from './chatFrontEnd/chatFrontEnd.module';

>>>>>>> a8d95fe2f4f10a0d57d0626754c127875efb3848

@Module({
  imports: [
    AdminModule,
    AuthModule,
    BoardModule,
    BoardLikeModule,
<<<<<<< HEAD
<<<<<<< HEAD
    ImageModule,
=======
    ChatBackEndModule, // 추가
    ChatFrontEndModule, // 추가
    ImageUploadModule,
>>>>>>> dc8f6e13e3e6a31c802e3b463a5873197f6e14cf
=======
    ImageModule,
    ChatBackEndModule, // 추가
    ChatFrontEndModule, // 추가
    ImageUploadModule,
>>>>>>> a8d95fe2f4f10a0d57d0626754c127875efb3848
    UserModule,
    NoticeModule,
    MessageModule,
    CommentModule,
    CommentLikeModule,
    ShopModule,
    PointTransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        Credential: true,
        origin: ['http://localhost', 'http://localhost'],
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'my-database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'team_project',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly connection: Connection) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}

// 이거 배포할때 설정하는것
// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: '10.16.96.3',
//   port: 3306,
//   username: 'root',
//   password: 'root',
//   database: 'team_data',
//   entities: [__dirname + '/apis/**/*.entity.*'],
//   synchronize: true,
//   logging: true,
//   retryAttempts: 30,
//   retryDelay: 5000,
// }),
// CacheModule.register<RedisClientOptions>({
//   store: redisStore,
//   url: 'redis://XkjocNA3@10.140.0.4:6379',
//   isGlobal: true,
// }),

// 이건 로컬 테스트용
// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: 'my-database',
//   port: 3306,
//   username: 'root',
//   password: 'root',
//   database: 'team_project',
//   entities: [__dirname + '/apis/**/*.entity.*'],
//   synchronize: true,
//   logging: true,
//   retryAttempts: 30,
//   retryDelay: 5000,
// }),
// CacheModule.register<RedisClientOptions>({
//   store: redisStore,
//   url: 'redis://my-redis:6379',
//   isGlobal: true,
// }),

// 2번째 배포
// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: '10.32.96.4',
//   port: 3306,
//   username: 'root',
//   password: 'root',
//   database: 'teamproject',
//   entities: [__dirname + '/apis/**/*.entity.*'],
//   synchronize: true,
//   logging: true,
//   retryAttempts: 30,
//   retryDelay: 5000,
// }),
// CacheModule.register<RedisClientOptions>({
//   store: redisStore,
//   url: 'redis://voG6BgVH@10.140.0.2:6379',
//   isGlobal: true,
// }),
