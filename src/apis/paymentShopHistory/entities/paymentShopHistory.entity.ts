import { Field, Float, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class PaymentShopHistory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  paymentShopHistoryId: string;

  @Column()
  @Field(() => String, { defaultValue: null })
  historyShopProductName: string;

  @Column()
  @Field(() => String, { defaultValue: null })
  historyShopSeller: string;

  @Column()
  @Field(() => Float, { defaultValue: 0 })
  historyShopPrice: number;

  @Column()
  @Field(() => Float, { defaultValue: 0 })
  historyShopStock: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  userId: User;
}
