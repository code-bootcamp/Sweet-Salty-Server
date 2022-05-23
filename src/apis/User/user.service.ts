import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}
  // Create Api Create Api Create Api Create Api Create Api Create Api Create Api Create Api Create Api //
  async create({ createUserInput }) {
    const overlap = await this.UserRepository.findOne({
      where: {
        user_email: createUserInput.user_email,
      },
    });
    if (overlap)
      throw new ConflictException('동일한 이메일로 생성된 계정이 존재합니다.');
    createUserInput.password = await bcrypt.hash(createUserInput.password, 10);
    const result = await this.UserRepository.save({
      ...createUserInput,
    });

    return result;
  }
  //
  //
  async socialCreate({ user }) {
    const social_user = await this.UserRepository.findOne({
      where: { user_email: user.user_email },
    });

    if (!social_user) {
      const result = await this.UserRepository.save({
        ...user,
        password: await bcrypt.hash(
          String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
          10,
        ),
      });
      return result;
    } else {
      return await this.UserRepository.findOne({
        where: { user_email: user.user_email },
      });
    }
  }
  //
  //
  // Read Api Read Api Read Api Read Api Read Api Read Api Read Api Read Api Read Api Read Api Read Api  //
  async findOne({ user_email }) {
    return await this.UserRepository.findOne({ where: { user_email } }); // 마이페이지 읽어올때 사용할거임 조건 댓글같은거 보려면 조건 더 달아야함
  }
  //
  //
  async findAll() {
    return await this.UserRepository.find({});
  }
  //
  //
  async finDeleteAll() {
    return await this.UserRepository.find({ withDeleted: true });
  }
  //
  //
  // Update Api Update Api  Update Api  Update Api  Update Api  Update Api  Update Api  Update Api  Update Api  //
  async update({ user_email, updateUserInput }) {
    const user = await this.UserRepository.findOne({ where: { user_email } });
    const updateData = {
      ...user,
      ...updateUserInput,
    };
    return await this.UserRepository.save(updateData);
  }
  //
  //
  async ChangePW({ password, user_email }) {
    // 인증 절차가 조금 더 필요할 것 같음. 이메일 하나만 받으면 안댐 핸폰 인증 추가 예정
    const PWLoseUser = await this.UserRepository.findOne({
      where: { user_email },
    });
    if (PWLoseUser) {
      const NewPW = {
        ...PWLoseUser,
        password: await bcrypt.hash(password, 10),
      };
      return await this.UserRepository.save(NewPW);
    }
  }
  //
  //
  async loginUpdate({ user_email, password }) {
    // 마이페이지에 연동될 예정이라 이것도 여러가지 바꿀 수 있게 해야함
    const user = await this.UserRepository.findOne({ where: { user_email } });
    user.password = await bcrypt.hash(password, 10);
    const newUserData = {
      ...user,
    };
    return await this.UserRepository.save(newUserData);
  }
  //
  //
  async SocialUpdate({ user_email, updateSocilaInput }) {
    // 마이페이지에 연동될 예정이라 이것도 여러가지 바꿀 수 있게 해야함
    const user = await this.UserRepository.findOne({ where: { user_email } });
    const newUser = {
      ...user,
      ...updateSocilaInput,
    };
    return await this.UserRepository.save(newUser);
  }
  //
  //
  //async phoneUpdate ({}){} <- 지금 핸드폰 번호를 받아와야하는 로직이 따로 없음. 근데 이걸 회원가입에서 받아야할지 고민중이라
  // 추가하긴 해야하는데 언제 받을지 고민중
  //
  //
  // Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api Delete Api //
  async delete({ user_email }) {
    const result = await this.UserRepository.softDelete({ user_email }); // 이것도 바껴야함
    return result.affected ? true : false;
  }
  //
  //
  async restore({ user_email }) {
    const result = await this.UserRepository.restore({ user_email }); // 다양한 조건으로 삭제 가능
    return result.affected ? true : false;
  }
}
