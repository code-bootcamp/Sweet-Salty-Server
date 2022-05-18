import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ShopService } from './shop.service';
import { Shop } from './entities/shop.entity';
import { CreateShopInput } from './dto/createShop.input';
import { updateShopInput } from './dto/updateShop.input';

@Resolver()
export class ShopResolver {
  constructor(
    private readonly shopSerivece: ShopService, //
  ) {}

  //   @Query(() => [Shop])
  //   fetchShops() {
  //     return this.shopSerivece.findAll();
  //   }

  @Query(() => Shop)
  fetchShop(@Args('shopId') shopId: string) {
    return this.shopSerivece.findOne({ shopId });
  }

  @Mutation(() => Shop)
  createShop(@Args('createShopInput') createShopInput: CreateShopInput) {
    return this.shopSerivece.create({ createShopInput });
  }

  @Mutation(() => Shop)
  async updateShop(
    @Args('shopId') shopId: string,

    @Args('updateShopInput') updateShopInput: updateShopInput,
  ) {
    // 수정하기
    return await this.shopSerivece.update({
      shopId,
      updateShopInput,
    });
  }

  //   @Mutation(() => Boolean)
  //   deleteProduct(@Args('productId') productId: string) {
  //     return this.productService.delete({ productId });
  //   }

  //   @Mutation(() => Boolean)
  //   restoreOne(@Args('productId') productId: string) {
  //     return this.productService.restoreOne({ productId });
  //   }
}
