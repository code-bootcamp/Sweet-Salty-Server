import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BoardSide } from 'src/apis/boardSide/entities/boardSide.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum REF_CODE_ENUM {
  MENU = 'MENU',
  REGION = 'REGION',
  MOOD = 'MOOD',
}

registerEnumType(REF_CODE_ENUM, {
  name: 'REF_CODE_ENUM',
});

@ObjectType()
@Entity()
export class BoardTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  boardTagId: string;

  @Column({ unique: true })
  @Field(() => String)
  boardTagName: string;

  @Column({ type: 'enum', enum: REF_CODE_ENUM })
  @Field(() => REF_CODE_ENUM)
  boardTagRefCode: string;

  @OneToMany((type) => BoardSide, (BoardSide) => BoardSide.boardTags)
  boardSides: BoardSide[];
}
