import { Test, TestingModule } from '@nestjs/testing';
import { CustomerNotesController } from './customer-notes.controller';
import { CustomerNotesService } from './customer-notes.service';

describe('CustomerNotesController', () => {
  let controller: CustomerNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerNotesController],
      providers: [CustomerNotesService],
    }).compile();

    controller = module.get<CustomerNotesController>(CustomerNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
