import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { BoardTag } from 'src/apis/boardTag/entities/boardTag.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class BoardSide extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  boardSideId: string;

  @ManyToOne((type) => BoardTag, (BoardTag) => BoardTag.boardSide)
  @JoinColumn({ name: 'boardTagId', referencedColumnName: 'boardTagId' })
  @Field(() => BoardTag)
  boardTags: BoardTag;

  @ManyToOne((type) => Board, (Board) => Board.boardSides)
  @JoinColumn({ name: 'boardId', referencedColumnName: 'boardId' })
  boards: Board[];
}
