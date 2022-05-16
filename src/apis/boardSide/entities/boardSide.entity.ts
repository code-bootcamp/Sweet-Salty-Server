import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { BoardTag } from 'src/apis/boardTag/entities/boardTag.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class BoardSide {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  boardSide: string;

  @Column()
  @Field(() => String)
  tagName: string;

  @ManyToOne((type) => BoardTag, (BoardTag) => BoardTag.boardSides)
  @JoinColumn({ name: 'boardTagId', referencedColumnName: 'boardTagId' })
  @Field(() => BoardTag)
  boardTags: BoardTag;

  @ManyToOne((type) => Board, (Board) => Board.boardSides)
  @JoinColumn({ name: 'boardId', referencedColumnName: 'boardId' })
  boards: Board[];
}
