import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { GraphQLJSONObject } from 'graphql-type-json';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { BoardTagsInput } from './dto/createBoardTags.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { Board, Tags } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(
    //

    private readonly boardService: BoardService,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => GraphQLJSONObject)
  async fetchBoardWithTags(
    //
    @Args('tags') tags: Tags,
  ) {
    const tagsData = tags.names.reduce((acc, cur) => {
      const tag = cur.substring(1);
      return acc === '' ? acc + tag : acc + ' ' + tag;
    }, '');

    const redisInData = await this.cacheManager.get(tagsData);

    if (redisInData) {
      return redisInData;
    } else {
      const data = await this.elasticsearchService.search({
        index: 'board',
        size: 100,
        sort: 'createat',
        _source: [
          'boardtitle',
          'boardwriter',
          'boardlikecount',
          'boardhit',
          'createat',
        ],
        query: {
          match: {
            tags: {
              query: tagsData,
              operator: 'and',
            },
          },
        },
      });

      await this.cacheManager.set(tagsData, data, { ttl: 30 });
      return data;
    }
  }

  @Query(() => [Board])
  fetchBoards(
    //
    @Args('search') search: string,
  ) {
    return this.boardService.findAll();
  }

  @Query(() => Board)
  fetchBoard(@Args('boardId') boardId: string) {
    return this.boardService.findOne({ boardId });
  }

  @Query(() => [Board])
  fetchTestBoards(
    //
    @Args('boardTagsInput') boardTagsInput: BoardTagsInput,
  ) {
    return this.boardService.findTest({ boardTagsInput });
  }

  @Query(() => [Board])
  fetchGenderBoards(
    @Args('gender') gender: string,
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return this.boardService.findGender({ gender, page });
  }

  @Query(() => [Board])
  fetchAgeGroupBoards(
    @Args('ageGroup') ageGroup: string,
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return this.boardService.findAgeGroup({ ageGroup, page });
  }

  @Query(() => [Board])
  fetchAgeGroupWithGenderBoards(
    @Args('gender') gender: string,
    @Args('ageGroup') ageGroup: string,
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return this.boardService.findGenderWithAgeGroup({ gender, ageGroup, page });
  }

  @Mutation(() => Board)
  createBoard(
    //

    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Args('createBoardTagsInput') boardTagsInput: BoardTagsInput,
  ) {
    return this.boardService.create({ createBoardInput, boardTagsInput }); // 받아온 name 넘기기 service로
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  createBoardUserLoggedin(
    //
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Args('createBoardTagsInput') boardTagsInput: BoardTagsInput,
  ) {
    return this.boardService.loginCreate({
      currentUser,
      createBoardInput,
      boardTagsInput,
    });
  }

  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,

    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    return await this.boardService.update({
      boardId,
      updateBoardInput,
    });
  }

  @Mutation(() => Boolean)
  deleteBoard(@Args('boardId') boardId: string) {
    return this.boardService.delete({ boardId });
  }
}
