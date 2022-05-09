import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/auth/gql-user-param';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {} // 이렇게 쓰면 서비스 ts에 있는 클래스를 가져다가 쓸 수 있음

  // Create Api Create Api Create Api Create Api Create Api Create Api Create Api Create Api Create Api //
  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, // args == 주는쪽
  ) {
    return this.userService.create({ createUserInput });
  }

  // Read Api Read Api Read Api Read Api Read Api Read Api Read Api Read Api Read Api Read Api Read Api  //
  @Query(() => User)
  fetchUser(
    //
    @Args('user_email') user_email: string,
  ) {
    return this.userService.findOne({ user_email });
  }
  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }
  //
  //

  // Update Api Update Api  Update Api  Update Api  Update Api  Update Api  Update Api  Update Api  Update Api  //
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: any,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.userService.update({
      user_email: currentUser.user_email,
      updateUserInput,
    }); // <- 이거 지워도 댐 로그인 안한 상태로 정보 바꾼다는거는 비번찾기만 가능
  }
  //
  //
  @Mutation(() => User)
  async updatePassword(
    @Args('user_email') user_email: string,
    @Args('password') password: string,
  ) {
    return await this.userService.ChangePW({ user_email, password });
  }
  //
  //

  //
  //

  // Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api //

  //
  //
  @Mutation(() => Boolean)
  deleteUser(
    @Args('user_email') user_email: string, //
  ) {
    return this.userService.delete({ user_email });
  }
  //
  //
  @Mutation(() => Boolean)
  restoreUser(
    @Args('user_email') user_email: string, //
  ) {
    return this.userService.restore({ user_email });
  }
}
