import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';

// Helper: mock $transaction that supports both styles:
// 1) $transaction([promise1, promise2])
// 2) $transaction(async (tx) => { ... })
function createPrismaMock() {
  const tx = {
    customers: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    customer_addresses: {
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  return {
    ...tx,
    $transaction: jest.fn(async (arg: any) => {
      if (Array.isArray(arg)) return Promise.all(arg);
      if (typeof arg === 'function') return arg(tx);
      throw new Error('Unsupported $transaction usage in test');
    }),
  };
}

describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('maps DTO fields to prisma', async () => {
      prisma.customers.create.mockResolvedValue({ id: 1 });

      await service.create({
        firstName: 'Marko',
        lastName: 'Stojanov',
        phoneNumber: '+38970000000',
      } as any);

      expect(prisma.customers.create).toHaveBeenCalledWith({
        data: {
          first_name: 'Marko',
          last_name: 'Stojanov',
          phone_number: '+38970000000',
        },
      });
    });
  });

  describe('findOne()', () => {
    it('throws NotFound if customer does not exist', async () => {
      prisma.customers.findUnique.mockResolvedValue(null);

      await expect(service.findOne(123)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws NotFound if customer exists but is inactive (default isActive=true)', async () => {
      prisma.customers.findUnique.mockResolvedValue({
        id: 1,
        is_active: false,
        customer_addresses: [],
      });

      await expect(service.findOne(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('returns customer if inactive and isActive=false', async () => {
      prisma.customers.findUnique.mockResolvedValue({
        id: 1,
        is_active: false,
        customer_addresses: [],
      });

      const customer = await service.findOne(1, false);
      expect(customer.id).toBe(1);
    });
  });

  describe('update()', () => {
    it('throws if dto is empty', async () => {
      await expect(service.update(1, {} as any)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('updates customer if dto has fields', async () => {
      // findOne() is called inside update()
      prisma.customers.findUnique.mockResolvedValue({
        id: 1,
        is_active: true,
        customer_addresses: [],
      });

      prisma.customers.update.mockResolvedValue({ id: 1 });

      await service.update(1, { first_name: 'New' } as any);

      expect(prisma.customers.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { first_name: 'New' },
      });
    });
  });

  describe('remove() soft delete', () => {
    it('soft-deletes customer and active addresses in a transaction', async () => {
      prisma.customers.findUnique.mockResolvedValue({
        id: 7,
        is_active: true,
        customer_addresses: [],
      });

      prisma.customers.update.mockResolvedValue({ id: 7 });
      prisma.customer_addresses.updateMany.mockResolvedValue({ count: 2 });

      await service.remove(7);

      expect(prisma.$transaction).toHaveBeenCalled();

      expect(prisma.customers.update).toHaveBeenCalledWith({
        where: { id: 7 },
        data: { is_active: false },
      });

      expect(prisma.customer_addresses.updateMany).toHaveBeenCalledWith({
        where: { customer_id: 7, is_active: true },
        data: { is_active: false },
      });
    });
  });

  describe('softDeleteMany()', () => {
    it('soft-deletes many customers and their active addresses', async () => {
      prisma.customers.updateMany.mockResolvedValue({ count: 2 });
      prisma.customer_addresses.updateMany.mockResolvedValue({ count: 3 });

      const res = await service.softDeleteMany([1, 2]);

      expect(prisma.customers.updateMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] }, is_active: true },
        data: { is_active: false },
      });

      expect(prisma.customer_addresses.updateMany).toHaveBeenCalledWith({
        where: { customer_id: { in: [1, 2] }, is_active: true },
        data: { is_active: false },
      });

      expect(res).toEqual({ message: 'Soft-deleted 2 customers' });
    });

    it('throws if ids is empty', async () => {
      await expect(service.softDeleteMany([])).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('hardDeleteMany()', () => {
    it('hard-deletes many customers and their addresses', async () => {
      prisma.customer_addresses.deleteMany.mockResolvedValue({ count: 5 });
      prisma.customers.deleteMany.mockResolvedValue({ count: 2 });

      const res = await service.hardDeleteMany([10, 11]);

      expect(prisma.customer_addresses.deleteMany).toHaveBeenCalledWith({
        where: { customer_id: { in: [10, 11] } },
      });

      expect(prisma.customers.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: [10, 11] } },
      });

      expect(res).toEqual({ message: 'Permanently deleted 2 customers' });
    });
  });

  describe('deleteAllPermanently()', () => {
    it('throws if there are no deleted customers', async () => {
      prisma.customer_addresses.deleteMany.mockResolvedValue({ count: 0 });
      prisma.customers.deleteMany.mockResolvedValue({ count: 0 });

      await expect(service.deleteAllPermanently()).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('returns message with count deleted', async () => {
      prisma.customer_addresses.deleteMany.mockResolvedValue({ count: 7 });
      prisma.customers.deleteMany.mockResolvedValue({ count: 3 });

      const res = await service.deleteAllPermanently();
      expect(res).toEqual({ message: 'Permanently deleted 3 customers' });
    });
  });
});
