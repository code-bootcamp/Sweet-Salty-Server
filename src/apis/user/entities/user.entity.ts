import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BOARD_AGE_GROUP_ENUM,
  BOARD_GENDER_ENUM,
} from 'src/apis/board/entities/board.entity';
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

  @Column({ default: false })
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

  @Column({ nullable: true, unique: true })
  @Field(() => String)
  userNickname: string;

  @Column({ nullable: true })
  @Field(() => String)
  userImage: string;

  @Column({ nullable: true })
  @Field(() => String)
  userPhone: string;

  @Column({ nullable: true })
  @Field(() => String)
  userAddress: string;

  @Column({ default: 0 })
  @Field(() => Int)
  userPoint: number;

  @Column({ type: 'enum', enum: BOARD_AGE_GROUP_ENUM })
  @Field(() => BOARD_AGE_GROUP_ENUM)
  ageGroup: string;

  @Column({ type: 'enum', enum: BOARD_GENDER_ENUM })
  @Field(() => BOARD_GENDER_ENUM)
  gender: string;

  @Column({ default: '단짠맛집' })
  userSignUpSite: string;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
