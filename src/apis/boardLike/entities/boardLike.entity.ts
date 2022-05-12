import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class BoardLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  boardLikeCountId: string;

  @ManyToOne(() => Board)
  board: Board;

  @ManyToOne(() => User)
  user: User;
}
