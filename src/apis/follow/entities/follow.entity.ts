import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Fallow {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  fallowId: string;

  @Column()
  @Field(() => String)
  fallowerId: string;

  @ManyToOne(() => User)
  @Field(() => User)
  fallowingId: string;
}
