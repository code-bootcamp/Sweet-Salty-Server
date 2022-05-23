import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';

import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { fewUser, User } from './entities/user.entity';

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
    @Args('userEmail') userEmail: string,
  ) {
    return this.userService.findOne({ userEmail });
  }
  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }

  @Query(() => fewUser)
  findUser(
    //
    @Args('phone') phone: string,
  ) {
    return this.userService.fewFind({ phone });
  }
  //
  //
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUserLoggedIn(@CurrentUser() currentUser: ICurrentUser) {
    return this.userService.findLoggedIn({ currentUser });
  }

  // Update Api Update Api  Update Api  Update Api  Update Api  Update Api  Update Api  Update Api  Update Api  //
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.userService.update({
      userEmail: currentUser.userEmail,
      updateUserInput,
    }); // <- 이거 지워도 댐 로그인 안한 상태로 정보 바꾼다는거는 비번찾기만 가능
  }
  //
  //
  @Mutation(() => User)
  async updatePassword(
    @Args('userEmail') userEmail: string,
    @Args('password') password: string,
  ) {
    return await this.userService.ChangePW({ userEmail, password });
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
    @Args('userEmail') userEmail: string, //
  ) {
    return this.userService.delete({ userEmail });
  }
  //
  //
  @Mutation(() => Boolean)
  restoreUser(
    @Args('userEmail') userEmail: string, //
  ) {
    return this.userService.restore({ userEmail });
  }
}
