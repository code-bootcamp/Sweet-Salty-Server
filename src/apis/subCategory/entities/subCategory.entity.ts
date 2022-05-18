import { Field, ObjectType } from '@nestjs/graphql';
import { Notice } from 'src/apis/notice/entities/notice.entity';
import { TopCategory } from 'src/apis/topCategory/entities/topCategory.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  subCategory: string;

  @Column({ unique: true })
  @Field(() => String)
  subCategoryName: string;

  @ManyToOne((type) => TopCategory, (TopCategory) => TopCategory.subCategories)
  @JoinColumn({
    name: 'TopCategoryId',
    referencedColumnName: 'topCategoryId',
  })
  topCategories: TopCategory;

  @OneToOne((type) => Notice, (Notice) => Notice.subCategory)
  notices: Notice[];
}
