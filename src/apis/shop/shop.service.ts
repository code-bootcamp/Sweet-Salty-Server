import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  //   async findAll() {
  //     const shops = await this.shopRepository.find({});
  //     return shops;
  //   }

  async findOne({ shopId }) {
    const shop = await this.shopRepository.findOne({
      where: { shopId },
    });
    return shop;
  }

  async create({ createShopInput }) {
    const shop = await this.shopRepository.save({
      ...createShopInput,
    });

    return shop;
  }

  async update({ shopId, updateShopInput }) {
    const shop = await this.shopRepository.findOne({
      where: { shopId },
    });

    const newShop = {
      ...shop,
      ...updateShopInput,
    };

    return await this.shopRepository.save(newShop);
  }

  //   async delete({ productId }) {
  //     const result = await this.productRepository.softDelete({
  //       id: productId,
  //     }); // 다양한 조건으로 삭제 가능!!
  //     return result.affected ? true : false;
  //   }

  //   async restoreOne({ productId }) {
  //     const result = await this.productRepository.restore({ id: productId });
  //     return result.affected ? true : false;
  //   }
}
