import { Test, TestingModule } from '@nestjs/testing';
import { CustomerNotesService } from './customer-notes.service';

describe('CustomerNotesService', () => {
  let service: CustomerNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerNotesService],
    }).compile();

    service = module.get<CustomerNotesService>(CustomerNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
