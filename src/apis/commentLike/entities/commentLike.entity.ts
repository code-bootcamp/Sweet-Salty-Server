import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  commentLikeCountId: string;

  @ManyToOne(() => Board)
  board: Board;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Comment)
  comment: Comment;
}
