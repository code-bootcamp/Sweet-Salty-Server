// @Query(() => [Board])
// fetchGenderBoards(
//   @Args({ name: 'gender', type: () => GENDER_ENUM })
//   gender: GENDER_ENUM,
//   @Args({ name: 'page', type: () => Int }) page: number,
// ) {
//   return this.boardService.findGender({ gender, page });
// }

// @Query(() => [Board])
// fetchAgeGroupBoards(
//   @Args({ name: 'ageGroup', type: () => AGE_GROUP_ENUM })
//   ageGroup: AGE_GROUP_ENUM,
//   @Args({ name: 'page', type: () => Int }) page: number,
// ) {
//   return this.boardService.findAgeGroup({ ageGroup, page });
// }

// @Query(() => [Board])
// fetchAgeGroupWithGenderBoards(
//   @Args({ name: 'gender', type: () => GENDER_ENUM })
//   gender: GENDER_ENUM,
//   @Args({ name: 'ageGroup', type: () => AGE_GROUP_ENUM })
//   ageGroup: AGE_GROUP_ENUM,
//   @Args({ name: 'page', type: () => Int }) page: number,
// ) {
//   return this.boardService.findGenderWithAgeGroup({ gender, ageGroup, page });
// }

// async findGender({ gender, page }) {
//     return await this.boardRepository.find({
//       where: { gender },
//       skip: (page - 1) * 10,
//       take: 10,
//       order: { createAt: 'DESC' },
//     });
//   }

//   async findAgeGroup({ ageGroup, page }) {
//     return await this.boardRepository.find({
//       where: {
//         ageGroup,
//       },
//       skip: (page - 1) * 10,
//       take: 10,
//       order: { createAt: 'DESC' },
//     });
//   }

//   async findGenderWithAgeGroup({ gender, ageGroup, page }) {
//     return await this.boardRepository.find({
//       where: {
//         gender,
//         ageGroup,
//       },
//       skip: (page - 1) * 10,
//       take: 10,
//       order: { createAt: 'DESC' },
//     });
//   }
