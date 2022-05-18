import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SubCategory } from 'src/apis/subCategory/entities/subCategory.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Notice {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => Int)
  noticeId: string;

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
  subCategory: SubCategory;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
