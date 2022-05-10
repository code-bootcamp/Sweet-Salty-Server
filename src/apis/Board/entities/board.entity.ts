import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/User/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column()
  @Field(() => String)
  boardContents: string;

  @Column({ nullable: true })
  @Field(() => String)
  boardWriter: string;

  @Column({ default: 0 })
  @Field(() => Int)
  boardHit: number;

  @CreateDateColumn()
  CreateAt: Date;

  @UpdateDateColumn()
  UpdateAt: Date;

  @ManyToOne(() => User)
  user: User;
}