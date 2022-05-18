import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { ShopResolver } from './shop.resolver';
import { ShopService } from './shop.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shop])],
  providers: [
    ShopService, //
    ShopResolver,
  ],
})
export class ShopModule {}
