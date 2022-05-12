import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardTag } from 'src/apis/boardTag/entities/boardTag.entity';
import { User } from 'src/apis/user/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('increment')
  @Field(() => String)
  boardId: string;

  @Column()
  @Field(() => String)
  boardTitle: string;

  @Column({ nullable: true })
  @Field(() => String)
  boardSugar: string;

  @Column({ nullable: true })
  @Field(() => String)
  boardSalt: string;

  @Column()
  @Field(() => String)
  boardContents: string;

  @Column({ nullable: true })
  @Field(() => String)
  boardWriter: string;

  @Column({ default: 0 })
  @Field(() => Int)
  boardLikeCount: number;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @ManyToOne(() => User)
  user: User;

  @JoinTable()
  @ManyToMany(() => BoardTag, (boardTags) => boardTags.boards)
  @Field(() => [BoardTag])
  boardTags: BoardTag[];
}
