import { Module } from '@nestjs/common';
import { RealTimeGateway } from './realTime.gateway';
@Module({
  providers: [RealTimeGateway],
})
export class RealTimeModule {}
