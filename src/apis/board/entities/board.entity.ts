import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BoardSide } from 'src/apis/boardSide/entities/boardSide.entity';
import { Store } from 'src/apis/store/store.entities/store.entity';
import { User } from 'src/apis/user/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BOARD_GENDER_ENUM {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  PRIVATE = 'PRIVATE',
}

export enum BOARD_AGE_GROUP_ENUM {
  TEN = 'TEN',
  TWENTY = 'TWENTY',
  THIRTY = 'THIRTY',
  FORTY = 'FORTY',
  FIFTY = 'FIFTY',
  SIXTY = 'SIXTY',
  NONE = 'NONE',
}

registerEnumType(BOARD_GENDER_ENUM, {
  name: 'BOARD_GENDER_ENUM',
});

registerEnumType(BOARD_AGE_GROUP_ENUM, {
  name: 'BOARD_AGE_GROUP_ENUM',
});

export abstract class Content {}

@InputType()
export class Tags {
  @Field(() => [String])
  names: string[];
}

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  boardId: number;

  @Column()
  @Field(() => String)
  boardTitle: string;

  @Column({ nullable: true })
  @Field(() => String)
  boardSugar: string;

  @Column({ nullable: true })
  @Field(() => String)
  boardSalt: string;

  @Column()
  @Field(() => String)
  boardContents: string;

  @Column({ nullable: true })
  @Field(() => String)
  boardWriter: string;

  @Column({ default: 0 })
  @Field(() => Int)
  boardLikeCount: number;

  @Column({ default: 0 })
  @Field(() => Int)
  boardHit: number;

  @Column({ type: 'enum', enum: BOARD_AGE_GROUP_ENUM })
  @Field(() => BOARD_AGE_GROUP_ENUM)
  ageGroup: string;

  @Column({ type: 'enum', enum: BOARD_GENDER_ENUM })
  @Field(() => BOARD_GENDER_ENUM)
  gender: string;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @ManyToOne(() => User)
  user: User;

  @OneToMany((type) => Store, (Store) => Store.boards)
  @Field(() => Store)
  stores: Store;

  @OneToMany((type) => BoardSide, (BoardSide) => BoardSide.boards)
  @JoinColumn({ name: 'boardSideId', referencedColumnName: 'boardSideId' })
  @Field(() => [BoardSide])
  boardSides: BoardSide[];
}
