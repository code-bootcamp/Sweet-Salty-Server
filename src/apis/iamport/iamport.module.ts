import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from '@nestjs/axios';
import { IamportController } from './imaport.controller';
import { IamportService } from './iamport.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [IamportController],
  providers: [
    IamportService, //
  ],
})
export class IamportModule {}
