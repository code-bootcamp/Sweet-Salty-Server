import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentShopHistory } from '../paymentShopHistory/entities/paymentShopHistory.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Shop } from './entities/shop.entity';
import { ShopResolver } from './shop.resolver';
import { ShopService } from './shop.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, User, PaymentShopHistory]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],

  providers: [
    ShopResolver, //
    ShopService,
    UserService,
  ],
})
export class ShopModule {}
