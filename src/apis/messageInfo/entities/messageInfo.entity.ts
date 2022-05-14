import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class MessageInfo {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  messageInfoId: string;

  @Column()
  @Field(() => String)
  messageInfoTitle: string;

  @Column()
  @Field(() => String)
  messageInfoContents: string;

  @Column({ default: 0 })
  deleteCheckData: number;

  @CreateDateColumn()
  createAt: Date;
}
