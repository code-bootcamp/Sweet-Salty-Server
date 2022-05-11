import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class ImageUpload {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  imageId: string;

  @Column()
  @Field(() => String)
  bucketName: string;

  @Column()
  @Field(() => String)
  url: string;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  // @ManyToOne(() => Post)
  // post: Post;
}
