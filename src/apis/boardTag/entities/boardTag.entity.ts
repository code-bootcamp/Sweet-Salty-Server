import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class BoardTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  boardTagId: string;

  @Column({ default: '없음' })
  @Field(() => String, { nullable: true })
  boardTagMenu: string;

  @Column({ default: '없음' })
  @Field(() => String, { nullable: true })
  boardTagRegion: string;

  @Column({ default: '없음' })
  @Field(() => String, { nullable: true })
  boardTagTogether: string;

  @ManyToMany(() => Board, (boards) => boards.boardTags)
  @Field(() => [Board])
  boards: Board[];
}
