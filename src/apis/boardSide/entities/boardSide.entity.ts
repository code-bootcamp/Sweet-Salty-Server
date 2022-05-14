import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { BoardTag } from 'src/apis/boardTag/entities/boardTag.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class BoardSide {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  boardSide: string;

  @ManyToOne((type) => BoardTag, (BoardTag) => BoardTag.boardSides)
  @Field(() => [BoardTag])
  boardTags: BoardTag;

  @ManyToOne((type) => Board, (Board) => Board.boardSides)
  boards: Board[];
}
