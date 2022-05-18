import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { noticeResolver } from './notice.resolver';
import { noticeService } from './notice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  providers: [noticeResolver, noticeService],
})
export class noticeModule {}
