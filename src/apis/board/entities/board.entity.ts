import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BoardSide } from 'src/apis/boardSide/entities/boardSide.entity';
import { Image } from 'src/apis/image/entites/image.entity';
import { Place } from 'src/apis/place/entities/place.entity';

import { SubCategory } from 'src/apis/subCategory/entities/subCategory.entity';
import { User } from 'src/apis/user/entities/user.entity';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SUB_CATEGORY_NAME_ENUM {
  REQUEST = 'REQUEST',
  VISITED = 'VISITED',
  REVIEW = 'REVIEW',
  TASTER = 'TASTER',
}

export enum GENDER_ENUM {
  PRIVATE = 'PRIVATE',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AGE_GROUP_ENUM {
  NONE = 'NONE',
  TEN = 'TEN',
  TWENTY = 'TWENTY',
  THIRTY = 'THIRTY',
  FORTY = 'FORTY',
  FIFTY = 'FIFTY',
  SIXTY = 'SIXTY',
}

registerEnumType(SUB_CATEGORY_NAME_ENUM, {
  name: 'SUB_CATEGORY_NAME_ENUM',
});

registerEnumType(GENDER_ENUM, {
  name: 'GENDER_ENUM',
});

registerEnumType(AGE_GROUP_ENUM, {
  name: 'AGE_GROUP_ENUM',
});

export abstract class Content {}

@Entity()
@ObjectType()
export class Board extends BaseEntity {
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

  @Column({ type: 'enum', enum: AGE_GROUP_ENUM })
  @Field(() => AGE_GROUP_ENUM)
  ageGroup: string;

  @Column({ type: 'enum', enum: GENDER_ENUM })
  @Field(() => GENDER_ENUM)
  gender: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne((type) => SubCategory, (SubCategory) => SubCategory.boards)
  @Field(() => SubCategory)
  subCategory: SubCategory;

  @ManyToOne((type) => Place, (Place) => Place.boards)
  @Field(() => Place)
  place: Place;

  @OneToMany((type) => BoardSide, (BoardSide) => BoardSide.boards)
  @JoinColumn({ name: 'boardSideId', referencedColumnName: 'boardSideId' })
  @Field(() => [BoardSide])
  boardSides: BoardSide[];

  @OneToMany((type) => Image, (Image) => Image.board)
  @Field(() => [Image])
  images: Image;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
