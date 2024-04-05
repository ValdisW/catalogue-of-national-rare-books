import { Test, TestingModule } from '@nestjs/testing';
import { BookToPersonService } from './book-to-person.service';

describe('BookToPersonService', () => {
  let service: BookToPersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookToPersonService],
    }).compile();

    service = module.get<BookToPersonService>(BookToPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
