import { Test, TestingModule } from '@nestjs/testing';
import { DynastyService } from './dynasty.service';

describe('DynastyService', () => {
  let service: DynastyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynastyService],
    }).compile();

    service = module.get<DynastyService>(DynastyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
