import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { BoardSide } from 'src/apis/boardSide/entities/boardSide.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class BoardTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  boardTagId: string;

  @Column({ select: true, nullable: true })
  @Field(() => String, { nullable: true })
  boardTagMenu: string;

  @Column({ select: true, nullable: true })
  @Field(() => String, { nullable: true })
  boardTagRegion: string;

  @Column({ select: true, nullable: true })
  @Field(() => String, { nullable: true })
  boardTagTogether: string;

  @OneToMany((type) => BoardSide, (BoardSide) => BoardSide.boardTags)
  boardSides: BoardSide[];
}
