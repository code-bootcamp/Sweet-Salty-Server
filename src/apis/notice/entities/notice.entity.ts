import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SubCategory } from 'src/apis/subCategory/entities/subCategory.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Notice extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  noticeId: number;

  @Column()
  @Field(() => String)
  noticeTitle: string;

  @Column()
  @Field(() => String)
  noticeContents: string;

  @Column({ default: '운영자' })
  noticeWriter: string;

  @Column({ default: 0 })
  @Field(() => Int)
  noticeHit: number;

  @ManyToOne((type) => SubCategory, (SubCategory) => SubCategory.notices)
  @Field(() => SubCategory)
  subCategory: SubCategory;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
