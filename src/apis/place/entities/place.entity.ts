import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Place extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  placeId: string;

  @Column()
  @Field(() => String)
  placeName: string;

  @Column()
  @Field(() => String)
  placeAddress: string;

  @Column()
  @Field(() => String)
  placeUrl: string;

  @Column()
  @Field(() => String)
  lat: string;

  @Column()
  @Field(() => String)
  lng: string;

  @OneToMany((type) => Board, (Board) => Board.place)
  boards: Board;
}
