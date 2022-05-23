import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';

class MonkUserRepository<User> {
  MonkUserData = [
    {
      userId: '826583c4-7584-4cf1-b182-5519d987cfec',
      userState: 'true',
      userEmail: 'yukina1418@gmail.com',
      userPassword:
        '$2b$10$CyjRLmQ3r1yrWmKP3WEi4OCFmzzW38zlC/x930l7dIdF0shkt1B.a',
      userName: '테스트',
      userNickName: '마요',
      userImage: 'dd',
      userPhone: '01034017015',
      userAddress: '주소',
      userPoint: 0,
      ageGroup: 'NONE',
      gender: 'PRIVATE',
      userSignUpSite: '단짠맛집',
      createAt: '2022-05-21 12:05:28.751354000',
      updateAt: '2022-05-21 12:05:43.958192000',
    },
  ];

  findOne({ email }) {
    const user = this.MonkUserData.filter((el) => el.userEmail === email);
    if (user.length) return user[0];
    return null;
  }
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MonkUserRepository<User>;
});
