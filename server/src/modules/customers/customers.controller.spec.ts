import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

describe('CustomersController', () => {
  let controller: CustomersController;
  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findDeleted: jest.fn(),
    restoreDeleted: jest.fn(),
    deleteAllPermanently: jest.fn(),
    hardDelete: jest.fn(),
    softDeleteMany: jest.fn(),
    hardDeleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [{ provide: CustomersService, useValue: serviceMock }],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calls service.findAll', async () => {
    serviceMock.findAll.mockResolvedValue({ data: [], meta: { page: 1 } });

    await controller.findAll({ search: 'marko' } as any);

    expect(serviceMock.findAll).toHaveBeenCalledWith({ search: 'marko' });
  });

  it('calls service.softDeleteMany', async () => {
    serviceMock.softDeleteMany.mockResolvedValue({ message: 'ok' });

    await controller.softDeleteMany({ ids: [1, 2] } as any);

    expect(serviceMock.softDeleteMany).toHaveBeenCalledWith([1, 2]);
  });

  it('calls service.hardDelete(id)', async () => {
    serviceMock.hardDelete.mockResolvedValue({ message: 'done' });

    await controller.hardDelete(5);

    expect(serviceMock.hardDelete).toHaveBeenCalledWith(5);
  });
});
