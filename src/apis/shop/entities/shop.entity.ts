import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  shopId: string;

  @Column()
  @Field(() => String)
  shopProductName: string;

  @Column()
  @Field(() => String)
  shopSeller: string;

  @Column()
  @Field(() => Int)
  shopDisCount: number;

  @Column()
  @Field(() => Float)
  shopDisCountPrice: number;

  @Column()
  @Field(() => Float)
  shopOriginalPrice: number;

  @Column()
  @Field(() => String)
  shopDescription: string;

  @Column()
  @Field(() => Int)
  shopStock: number;

  @Column()
  @Field(() => String)
  shopUrl: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
