import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';

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
  boardSugar: string;

  @Column({ nullable: true })
  @Field(() => String)
  boardSalt: string;

  @Column({ nullable: true })
  @Field(() => String)
  boardWriter: string;

  @Column({ default: 0 })
  @Field(() => Int)
  boardHit: number;

  @CreateDateColumn()
  @Field(() => Date)
  CreateAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  UpdateAt: Date;

  @ManyToOne(() => User)
  user: User;
}
