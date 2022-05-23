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
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  user_id: string;

  @Column({ default: 0 })
  @Field(() => Boolean)
  state: boolean;

  @Column({ unique: true })
  @Field(() => String)
  user_email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  @Field(() => String)
  user_name: string;

  @Column({ nullable: true })
  @Field(() => String)
  user_nickname: string;

  @Column({ nullable: true })
  @Field(() => String)
  user_phone: string;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @CreateDateColumn()
  @Field(() => Date)
  user_createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  user_updateAt: Date;

  @DeleteDateColumn()
  user_deleteAt: Date;
}
