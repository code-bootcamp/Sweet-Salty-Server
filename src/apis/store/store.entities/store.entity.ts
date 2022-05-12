import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class store {
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
}
