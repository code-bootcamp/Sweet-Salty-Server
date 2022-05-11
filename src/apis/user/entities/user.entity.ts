import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class fewUser {
  @Field(() => String)
  userEmail: string;

  @Field(() => Date)
  userCreateAt: Date;
}

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  userId: string;

  @Column({ default: 0 })
  @Field(() => Boolean)
  userState: boolean;

  @Column({ unique: true })
  @Field(() => String)
  userEmail: string;

  @Column()
  userPassword: string;

  @Column({ nullable: true })
  @Field(() => String)
  userName: string;

  @Column({ nullable: true })
  @Field(() => String)
  userNickname: string;

  @Column({ nullable: true })
  @Field(() => String)
  userPhone: string;

  @Column({ nullable: true })
  @Field(() => String)
  userAddress: string;

  @Column({ default: 0 })
  @Field(() => Int)
  userPoint: number;

  @CreateDateColumn()
  @Field(() => Date)
  userCreateAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  userUpdateAt: Date;

  @DeleteDateColumn()
  userDeleteAt: Date;
}
