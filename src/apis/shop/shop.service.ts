import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Connection, getConnection, Repository } from 'typeorm';
import { Image } from '../image/entities/image.entity';
import { PaymentShopHistory } from '../paymentShopHistory/entities/paymentShopHistory.entity';
import { Place } from '../place/entities/place.entity';
import { User } from '../user/entities/user.entity';
import { Shop } from './entities/shop.entity';
@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,

    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,

    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,

    @InjectRepository(PaymentShopHistory)
    private readonly PaymentHistoryRepository: Repository<PaymentShopHistory>,

    @InjectRepository(Image)
    private readonly ImageRepository: Repository<Image>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly connection: Connection,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async elasticsearchFindTitle({ title }) {
    const redisData = await this.cacheManager.get(title);

    if (redisData) {
      return redisData;
    }

    const data = await this.elasticsearchService.search({
      index: 'shop',
      size: 10000,
      sort: 'createat:desc',
      _source: [
        'shopproductname',
        'shopseller',
        'shopdiscount',
        'shopdiscountprice',
        'shoporiginalprice',
        'shopdescription',
        'shopstock',
        'thumbnail',
      ],
      query: {
        match: {
          shopproductname: title,
        },
      },
    });

    await this.cacheManager.set(title, data, { ttl: 10 });

    return data;
  }

  async elasticsearchFindSeller({ seller }) {
    const redisData = await this.cacheManager.get(seller);

    if (redisData) {
      return redisData;
    }

    const data = await this.elasticsearchService.search({
      index: 'shop',
      size: 10000,
      sort: 'createat:desc',
      _source: [
        'shopproductname',
        'shopseller',
        'shopdiscount',
        'shopdiscountprice',
        'shoporiginalprice',
        'shopdescription',
        'shopstock',
        'thumbnail',
      ],
      query: {
        match: {
          shopseller: seller,
        },
      },
    });

    await this.cacheManager.set(seller, data, { ttl: 10 });

    return data;
  }

  async findAll() {
    return await getConnection()
      .createQueryBuilder()
      .select('shop')
      .from(Shop, 'shop')
      .leftJoinAndSelect('shop.place', 'place')
      .orderBy('createAt', 'DESC')
      .getMany();
  }

  async findOne({ shopId }) {
    return await getConnection()
      .createQueryBuilder()
      .select('shop')
      .from(Shop, 'shop')
      .leftJoinAndSelect('shop.place', 'place')
      .where({ shopId })
      .orderBy('createAt', 'DESC')
      .getOne();
  }

  async findRealTime({}) {
    return await getConnection()
      .createQueryBuilder()
      .select('shop')
      .from(Shop, 'shop')
      .take(10)
      .orderBy('shop.createAt', 'DESC')
      .getMany();
  }

  async historyFindOne({ currentUser }) {
    return this.PaymentHistoryRepository.find({
      userId: currentUser.userId,
    });
  }

  async create({ createShopInput, currentUser }) {
    const adminCheck = await this.UserRepository.findOne({
      where: { userId: currentUser.userId },
    });
    const { place, ...shop } = createShopInput;
    console.log(place);

    if (adminCheck.userState) {
      // 가게 이름이 없으면 넣기
      const checkPlaceName = await this.placeRepository.findOne({
        placeName: place.placeName,
      });

      if (!checkPlaceName) {
        const placeId = await this.placeRepository.save({
          ...place,
        });

        await this.shopRepository.save({
          ...shop,
          place: placeId,
        });
      }

      await this.shopRepository.save({
        ...shop,
        place: checkPlaceName,
      });

      await this.ImageRepository.save({
        url: shop.thumbnail,
        shopId: shop.shopId,
      });

      return '등록 완료';
    }

    return new ConflictException('관리자로 등록 되어있지 않습니다.');
  }

  async update({ shopId, updateShopInput, currentUser }) {
    const adminCheck = await this.UserRepository.findOne({
      where: { userId: currentUser.userId },
    });

    const shopInfo = await this.shopRepository.findOne({
      where: { shopId },
    });
    if (adminCheck.userState) {
      if (shopInfo) {
        const newShop = {
          ...shopInfo,
          ...updateShopInput,
        };
        return await this.shopRepository.save(newShop);
      }
    }

    return new ConflictException('관리자로 등록 되어 있지 않습니다.');
  }

  async paymentShop({ shopId, currentUser, stock }) {
    const productName = await this.shopRepository.findOne({
      shopId,
    });
    const userPoint = await this.UserRepository.findOne({
      userId: currentUser.userId,
    });

    const original = productName.shopOriginalPrice;
    const discount = productName.shopDisCount / 100;
    const discountPrice = original * (1 - discount);
    const price = discountPrice * stock;

    if (!stock) return new ConflictException('수량을 선택해주세요.');

    if (productName.shopStock - stock < 0)
      return new ConflictException('재고가 부족해 구매할 수 없습니다.');

    if (userPoint.userPoint < price)
      return new ConflictException('포인트가 부족해 구매할 수 없습니다.');

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ userPoint: () => `userPoint - ${price}` })
        .where({ userId: currentUser.userId });

      await getConnection()
        .createQueryBuilder()
        .update(Shop)
        .set({ shopStock: () => `shopStock - ${stock}` })
        .where({ shopId });

      await this.PaymentHistoryRepository.save({
        historyShopPrice: price,
        historyShopProductName: productName.shopProductName,
        historyShopSeller: productName.shopSeller,
        historyShopStock: stock,
        userId: currentUser.userId,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
