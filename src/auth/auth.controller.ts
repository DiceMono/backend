import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService, ftTypes } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { FtAuthGuard } from './ft-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async mainpage() {
    return 'hello!';
  }

  @UseGuards(FtAuthGuard)
  @Get('token')
  async getToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { intra, login, image_url } = req.user;
    const ftUserInfo: ftTypes = {
      intra,
      login,
      image: image_url,
    };
    let user = await this.userService.userSearch(ftUserInfo);
    if (!user) {
      user = await this.userService.userSave(ftUserInfo);
    }
    const jwtToken = await this.authService.jwtGen(req.user, user.id);

    res.cookie('access_token', jwtToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    res.status(302).redirect('.');
    //res.status(302).redirect('http://localhost:80/auth');
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async profile(@Req() req) {
    const { id, login, image } = req.user;
    const findUser = await this.userService.findOne(id);
    const ftUserInfo = {
      id: id,
      intra: login,
      librarian: findUser.librarian,
      imageUrl: image,
    };
    return ftUserInfo;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout') //나중에 Post로 바꿔야함.
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.redirect('/');
    //res.status(302).redirect('http://localhost:80');
  }
}

//console.log(req.user);
//const tokenInfo = await this.authService.connectToken(ftToken);
//const access_token = tokenInfo.access_token;
//const userInfo = await this.authService.connectFt(req);
//const user = new User(userInfo.id, userInfo.intraid);
// const getToken = await this.authService.getToken(user);
