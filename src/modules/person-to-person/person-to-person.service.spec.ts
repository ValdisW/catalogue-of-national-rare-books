import { Test, TestingModule } from '@nestjs/testing';
import { PersonToPersonService } from './person-to-person.service';

describe('PersonToPersonService', () => {
  let service: PersonToPersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonToPersonService],
    }).compile();

    service = module.get<PersonToPersonService>(PersonToPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
