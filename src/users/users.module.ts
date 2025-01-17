import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UserRepository, User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
