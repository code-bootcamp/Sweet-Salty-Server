import { Field, Int, ObjectType } from '@nestjs/graphql';
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
export class PaymentHistory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  paymentHistoryId: string;

  @Column()
  @Field(() => Int)
  agoPaymentAmount: number;

  @Column()
  @Field(() => Int)
  afterPaymentAmount: number;

  @Column()
  @Field(() => Int)
  paymentAmount: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  userId: User;
}
