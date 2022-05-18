import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  shopId: string;

  @Column()
  @Field(() => String)
  productName: string;

  @Column()
  @Field(() => String)
  seller: string;

  @Column()
  @Field(() => Int)
  disCount: number;

  @Column()
  @Field(() => Int)
  disCountPrice: number;

  @Column()
  @Field(() => Int)
  originalPrice: number;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  stock: number;

  @Column()
  @Field(() => String)
  shopUrl: string;
}
