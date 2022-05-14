import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Store {
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

  @ManyToOne((type) => Board, (Board) => Board.stores)
  boards: Board[];
}
