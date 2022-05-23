import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class BoardLike extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  boardLikeCountId: string;

  @ManyToOne(() => Board)
  board: Board;

  @ManyToOne(() => User)
  user: User;
}
