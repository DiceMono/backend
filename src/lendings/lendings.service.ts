import { Injectable } from '@nestjs/common';
import { UpdateLendingDto } from './dto/update-lending.dto';
import { getConnection } from 'typeorm';
import { Lending } from './entities/lending.entity';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LendingsService {
  async create() {
    const connection = getConnection();
    const bookRepository = connection.getRepository(Book);
    const lendingRepository = connection.getRepository(Lending);

    // TODO : lending테이블에 user, book 테이블과 연동하여 저장
    const user1 = new User('minkykim', 1);
    // lending table에 book과 연결하여 데이터 저장
    bookRepository
      .createQueryBuilder('book')
      .where('book.id = :bookId', { bookId: 1 })
      .getOne()
      .then((bookData) => {
        lendingRepository.insert({
          book: bookData,
          condition: '양호',
          user: user1,
        });
      });

    return 'This action adds a new lending';
  }

  findAll() {
    const connection = getConnection();
    connection
      .getRepository(Lending)
      .find({ relations: ['book'] })
      .then((lendingData) => {
        console.log(lendingData);
      });
    return `This action returns all lendings`;
  }

  findOne(lendingId: number) {
    const connection = getConnection();
    connection
      .getRepository(Lending)
      .findOne({ where: { id: lendingId }, relations: ['book'] })
      .then((bookData) => {
        console.log(bookData);
      });
    return `This action returns a #${lendingId} lending`;
  }

  update(id: number, updateLendingDto: UpdateLendingDto) {
    return `This action updates a #${id} lending`;
  }

  remove(id: number) {
    return `This action removes a #${id} lending`;
  }
}
