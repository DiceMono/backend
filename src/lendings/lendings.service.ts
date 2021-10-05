import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateLendingDto } from './dto/update-lending.dto';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { Lending } from './entities/lending.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateLendingDto } from './dto/create-lending.dto';
import { SlackbotService } from 'src/slackbot/slackbot.service';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';

async function checkLendingCnt(userId: number) {
  const userData = await getConnection().getRepository('User').findOne(userId);
  if (userData == undefined) return 0;
  const today: Date = new Date();
  const penalty: Date = new Date(userData['penaltiyAt']);
  if (2 <= userData['lendingCnt'] || today <= penalty) return 0;
  return 1;
}

async function checkLibrarian(librarianId: number) {
  const librarian = await getConnection()
    .getRepository('User')
    .findOne(librarianId);
  if (librarian == undefined) return 0;
  if (!librarian['librarian']) return 0;
  return 1;
}

@Injectable()
export class LendingsService {
  constructor(
    @InjectRepository(Lending)
    private readonly lendingsRepository: Repository<Lending>,
    private connection: Connection,
    private readonly slackbotService: SlackbotService,
    private readonly userService: UsersService,
    private readonly booksService: BooksService,
  ) {}

  async create(dto: CreateLendingDto, librarianId: number) {
    if (
      !(await checkLendingCnt(dto.userId)) ||
      !(await checkLibrarian(librarianId))
    )
      throw new BadRequestException(dto.userId || librarianId);
    try {
      await this.connection.transaction(async (manager) => {
        await manager.insert(Lending, {
          condition: dto.condition,
          user: { id: dto.userId },
          librarian: { id: librarianId },
          book: { id: dto.bookId },
        });
        await manager.update(User, dto.userId, {
          lendingCnt: () => 'lendingCnt + 1',
        });
      });
      const findUser = await this.userService.findOne(dto.userId);
      const { title } = await this.booksService.findOne(dto.bookId);
      const now = new Date();
      const limitDay = new Date(
        now.setDate(now.getDate() + 14),
      ).toLocaleDateString();
      const message =
        '📔' +
        ' 대출 알리미 ' +
        '📔\n' +
        '대출 하신 ' +
        '`' +
        title +
        '`' +
        '은(는) ' +
        limitDay +
        '까지 반납해주세요.';
      this.slackbotService.publishMessage(findUser.slack, message);
    } catch (e) {
      throw new Error("lendings.service.create() catch'");
    }
    return 'This action adds a new lending';
  }

  async findAll() {
    return await this.lendingsRepository.find({
      relations: ['user', 'librarian', 'book', 'returning', 'book.info'],
      where: { returning: null },
    });
  }
  async findOne(lendingId: number) {
    const lendingData = await this.lendingsRepository.findOne({
      relations: ['user', 'librarian', 'book', 'returning', 'book.info'],
      where: { id: lendingId },
    });
    if (lendingData == undefined || lendingData['returning'])
      throw new NotFoundException();
    return lendingData;
  }

  update(id: number, updateLendingDto: UpdateLendingDto) {
    return `This action updates a #${id} lending`;
  }

  remove(id: number) {
    return `This action removes a #${id} lending`;
  }
}
