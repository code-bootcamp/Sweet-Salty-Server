import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MessageInfo } from 'src/apis/messageInfo/entities/messageInfo.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SEND_RECEIVED {
  SEND = 'SEND',
  RECEIVED = 'RECEIVED',
}

registerEnumType(SEND_RECEIVED, {
  name: 'SEND_RECEIVED',
});

@ObjectType()
export class SendMessage {
  @Field(() => String)
  messageReceivedUser: string;

  @Field(() => MessageInfo)
  messageInfo: MessageInfo;

  @Field(() => Date)
  sendAt: Date;
}

@ObjectType()
export class ReceivedMessage {
  @Field(() => String)
  messageSendUser: string;

  @Field(() => Boolean)
  messageState: boolean;

  @Field(() => MessageInfo)
  messageInfo: MessageInfo;

  @Field(() => Date)
  sendAt: Date;
}

@ObjectType()
@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  messageId: string;

  @Column({ nullable: true })
  @Field(() => String)
  messageSendUser: string;

  @Column({ nullable: true })
  @Field(() => String)
  messageReceivedUser: string;

  @Column({ type: 'enum', enum: SEND_RECEIVED })
  @Field(() => SEND_RECEIVED)
  sendReceived: string;

  @Column({ default: false })
  @Field(() => Boolean)
  messageState: boolean;

  @ManyToOne(() => MessageInfo)
  @Field(() => MessageInfo)
  messageInfo: MessageInfo;

  @Column()
  messageOwner: string;

  @CreateDateColumn()
  @Field(() => Date)
  sendAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  readAt: Date;
}