import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../image/entities/image.entity';
import { PaymentHistory } from '../paymentHistory/entities/paymentHistory.entity';
import { Place } from '../place/entities/place.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Shop } from './entities/shop.entity';
import { ShopResolver } from './shop.resolver';
import { ShopService } from './shop.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Shop, Place, Image, PaymentHistory]),
    ElasticsearchModule.register({
      node: 'http://147.47.209.114:9200',
    }),
  ],

  providers: [
    ShopResolver, //
    ShopService,
    UserService,
  ],
})
export class ShopModule {}
