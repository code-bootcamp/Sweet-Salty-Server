import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ShopService } from './shop.service';
import { Shop } from './entities/shop.entity';
import { CreateShopInput } from './dto/createShop.input';
import { updateShopInput } from './dto/updateShop.input';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { PaymentShopHistory } from '../paymentShopHistory/entities/paymentShopHistory.entity';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver()
export class ShopResolver {
  constructor(
    private readonly shopSerivece: ShopService, //
  ) {}

  @Query(() => GraphQLJSONObject)
  fetchShopTitles(@Args('title') title: string) {
    return this.shopSerivece.elasticsearchFindTitle({ title });
  }

  @Query(() => GraphQLJSONObject)
  fetchShopSeller(@Args('seller') seller: string) {
    return this.shopSerivece.elasticsearchFindSeller({ seller });
  }

  @Query(() => [Shop])
  fetchShops() {
    return this.shopSerivece.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [PaymentShopHistory])
  shopHistoryFindOne(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return this.shopSerivece.histroyFindOne({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Shop)
  createShop(
    @Args('createShopInput') createShopInput: CreateShopInput, //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.shopSerivece.create({ createShopInput, currentUser });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Shop)
  async updateShop(
    @Args('shopId') shopId: string,
    @CurrentUser() currentUser: ICurrentUser,
    @Args('updateShopInput') updateShopInput: updateShopInput,
  ) {
    // 수정하기
    return await this.shopSerivece.update({
      shopId,
      updateShopInput,
      currentUser,
    });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  payShop(
    @Args(`stock`) stock: number,
    @Args('shopId') shopId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.shopSerivece.paymentShop({ shopId, currentUser, stock });
  }

  //   @Mutation(() => Boolean)
  //   restoreOne(@Args('productId') productId: string) {
  //     return this.productService.restoreOne({ productId });
  //   }
}
