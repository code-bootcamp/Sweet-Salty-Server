import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  storeId: string;

  @Column()
  @Field(() => String)
  storeName: string;

  @Column()
  @Field(() => String)
  storeAddress: string;

  @Column()
  @Field(() => String)
  storeAddressInfo: string;

  @Column()
  @Field(() => String)
  storeUrl: string;

  @ManyToOne((type) => Board, (Board) => Board.stores)
  boards: Board[];
}
