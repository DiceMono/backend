import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LendingsModule } from './lendings/lendings.module';
import { ReturningsModule } from './returnings/returnings.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ReservationsModule } from './reservations/reservations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

import { User } from './users/entities/user.entity';
import { Returning } from './returnings/entities/returning.entity';
import { Lending } from './lendings/entities/lending.entity';
import { Book } from './books/entities/book.entity';
import { BookInfo } from './books/entities/bookInfo.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { SeedModule } from './seed/seed.module';
import { SlackbotModule } from './slackbot/slackbot.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    LendingsModule,
    ReturningsModule,
    UsersModule,
    BooksModule,
    ReservationsModule,
    AuthModule,
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [User, Returning, Lending, Book, BookInfo, Reservation],
        synchronize: true,
        autoLoadEntities: true,
        seeds: ['src/seeds/**/*{.ts,.js}'],
        factories: ['src/factories/**/*{.ts,.js}'],
      }),
    }),
    SearchModule,
    SeedModule,
    SlackbotModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
