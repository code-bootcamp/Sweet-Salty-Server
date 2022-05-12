import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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
  url: string;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @ManyToOne(() => Board)
  board: Board;
}
