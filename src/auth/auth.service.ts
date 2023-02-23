import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Users } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user || user.password !== password)
      throw new ForbiddenException({
        status: false,
        message: 'Email or password not correct',
      });
    return user;
  }

  async sign(user: Users) {
    const accessToken = await this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken: accessToken,
    };
  }
  async registerUser(createUserDto: CreateUserDto) {
    const checkUserExist = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    console.log(checkUserExist);
    if (!checkUserExist) {
      const newUser = await this.userService.create(createUserDto);
      const accessToken = await this.jwtService.sign({
        sub: newUser.id,
        email: newUser.email,
      });
      return {
        accessToken: accessToken,
      };
    } else {
      throw new ForbiddenException({
        status: false,
        message: 'User already exist',
      });
    }
  }

  async getProfile(email: string) {
    const user = await this.userService.findOneByEmail(email);
    return {
      status:true,
      data:user
    };
  }
}
