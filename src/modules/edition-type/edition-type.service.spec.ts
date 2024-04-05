import { Test, TestingModule } from '@nestjs/testing';
import { EditionTypeService } from './edition-type.service';

describe('EditionTypeService', () => {
  let service: EditionTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditionTypeService],
    }).compile();

    service = module.get<EditionTypeService>(EditionTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
