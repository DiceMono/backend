import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookInfo } from './entities/bookInfo.entity';
import { Book } from './entities/book.entity';
import {
  paginate,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { getConnection } from 'typeorm';


function setBookDatas(bookData) {
  for (const book of bookData.books) {
    if (book.status == 1) book.status = '비치중';
    else if (book.status == 2) book.status = '대출중';
    else if (book.status == 3) book.status = '분실';
    else if (book.status == 4) book.status = '파손';
  }
  const date = new Date(bookData.publishedAt);
  bookData.publishedAt = date.getFullYear() + '년 ' + date.getMonth() + '월';
  return bookData;
}

@Injectable()
export class BooksService {
   constructor(
    @InjectRepository(BookInfo)
    private bookInfosRepository: Repository<BookInfo>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create() {
    return 'This action adds a new book';
  }

  async search(options: IPaginationOptions) {
    return paginate(this.bookInfosRepository, options);
  }

  async findAll() {
    const connection = getConnection();
    return connection.manager.find(BookInfo);
  }

  async findOne(bookInfoId: number) {
    const connection = getConnection();
    const bookInfoRepository = connection.getRepository(BookInfo);

    const resultData = bookInfoRepository
      .findOne({
        where: { id: bookInfoId },
        relations: ['books', 'books.lendings'],
      })
      .then((bookData) => {
        return setBookDatas(bookData);
      })
      .then((tBookData) => {
        return tBookData;
      });
    return resultData;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
