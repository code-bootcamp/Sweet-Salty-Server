import { Ip, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { BoardService } from './board.service';
import { BoardTagsInput } from './dto/boardTags.input';
import {
  CreateBoardInput,
  CreateBoardWithReqInput,
} from './dto/createBoard.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import {
  AGE_GROUP_ENUM,
  Board,
  GENDER_ENUM,
  BOARD_SUB_CATEGORY_NAME_ENUM,
} from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(
    //

    private readonly boardService: BoardService,
  ) {}

  @Query(() => [Board])
  async fetchBoardTitle(
    //
    @Args('title') title: string,
  ) {
    return this.boardService.test({ title });
  }

  @Query(() => GraphQLJSONObject)
  async fetchBoardTitles(@Args('title') title: string) {
    return this.boardService.elasticsearchFindTitle({ title });
  }

  @Query(() => GraphQLJSONObject)
  async fetchBoardContents(@Args('contents') contents: string) {
    return this.boardService.elasticsearchFindContents({ contents });
  }

  @Query(() => GraphQLJSONObject)
  async fetchBoardWithTags(
    //
    @Args({ name: 'tags', type: () => [String] }) tags: string[],
  ) {
    return this.boardService.elasticsearchFindTags({ tags });
  }

  @Query(() => Board)
  fetchBoard(
    //
    @Args('boardId') boardId: string,
    @Context() context: any,
  ) {
    const ip = context.req.clientIp;
    return this.boardService.findOne({ boardId, ip });
  }

  @Query(() => [Board])
  fetchBoards() {
    return this.boardService.findAll();
  }

  @Query(() => [Board])
  fetchBoardCategoryPick(
    //
    @Args({ name: 'category', type: () => BOARD_SUB_CATEGORY_NAME_ENUM })
    category: BOARD_SUB_CATEGORY_NAME_ENUM,
  ) {
    return this.boardService.findPickList({ category });
  }

  @Query(() => [Board])
  fetchGenderBoards(
    @Args({ name: 'gender', type: () => GENDER_ENUM })
    gender: GENDER_ENUM,
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return this.boardService.findGender({ gender, page });
  }

  @Query(() => [Board])
  fetchAgeGroupBoards(
    @Args({ name: 'ageGroup', type: () => AGE_GROUP_ENUM })
    ageGroup: AGE_GROUP_ENUM,
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return this.boardService.findAgeGroup({ ageGroup, page });
  }

  @Query(() => [Board])
  fetchAgeGroupWithGenderBoards(
    @Args({ name: 'gender', type: () => GENDER_ENUM })
    gender: GENDER_ENUM,
    @Args({ name: 'ageGroup', type: () => AGE_GROUP_ENUM })
    ageGroup: AGE_GROUP_ENUM,
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return this.boardService.findGenderWithAgeGroup({ gender, ageGroup, page });
  }

  @Query(() => [Board])
  fetchBoardBest(
    @Args({ name: 'category', type: () => BOARD_SUB_CATEGORY_NAME_ENUM })
    category: BOARD_SUB_CATEGORY_NAME_ENUM,
  ) {
    return this.boardService.best({ category });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Board)
  fetchLoggedInLikeBoard(@CurrentUser() currentUser: ICurrentUser) {
    return this.boardService.findLikeBoard({ currentUser });
  }

  @Query(() => [Board])
  fetchBoardsOfUser(@Args('userNickname') userNickname: string) {
    return this.boardService.findUser({ userNickname });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  createBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Args('boardTagsInput') boardTagsInput: BoardTagsInput,
  ) {
    return this.boardService.create({
      createBoardInput,
      boardTagsInput,
      currentUser,
    });
  }

  @Mutation(() => Board)
  createBoardReq(
    @Args('createBoardWhitReqInput')
    createBoardWhitReqInput: CreateBoardWithReqInput,
  ) {
    return;
  }

  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
    @Args('boardTagsInput') boardTagsInput: BoardTagsInput,
  ) {
    return await this.boardService.update({
      boardId,
      updateBoardInput,
      boardTagsInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('boardId') boardId: string,
  ) {
    return this.boardService.delete({ boardId, currentUser });
  }
}
