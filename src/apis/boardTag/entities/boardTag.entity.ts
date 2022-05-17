import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BoardSide } from 'src/apis/boardSide/entities/boardSide.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum REF_Name_ENUM {
  'MENU' = 'MENU',
  'REGION' = 'REGION',
  'MOOD' = 'MOOD',
}

registerEnumType(REF_Name_ENUM, {
  name: 'REF_Name_ENUM',
});

@ObjectType()
@Entity()
export class BoardTag {
  @PrimaryGeneratedColumn('uuid')
  boardTagId: string;

  @Column({ unique: true })
  @Field(() => String)
  boardTagName: string;

  @Column({ type: 'enum', enum: REF_Name_ENUM })
  @Field(() => REF_Name_ENUM)
  boardTagRefName: string;

  @OneToMany((type) => BoardSide, (BoardSide) => BoardSide.boardTags)
  boardSides: BoardSide[];
}
