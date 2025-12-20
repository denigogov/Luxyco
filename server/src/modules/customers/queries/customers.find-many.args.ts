import { CustomersQueryDto } from '../dto/get-customers.dto';

type SortDir = 'asc' | 'desc';

export function buildCustomersFindManyArgs(
  query: CustomersQueryDto,
  customerAddressSelect: any,
  isActive: boolean,
) {
  const { name, city, street, phoneNumber, search, sortBy, sortDir, village } =
    query;

  const where: any = { is_active: isActive };
  const AND: any[] = [];

  // Global search
  if (search) {
    where.OR = [
      { first_name: { contains: search } },
      { last_name: { contains: search } },
      { phone_number: { contains: search } },
      {
        customer_addresses: {
          some: {
            is_active: true,
            OR: [
              { city: { contains: search } },
              { street: { contains: search } },
              { village: { contains: search } },
            ],
          },
        },
      },
    ];
  }

  // Name filter
  if (name) {
    AND.push({
      OR: [
        { first_name: { contains: name } },
        { last_name: { contains: name } },
      ],
    });
  }

  // Phone filter
  if (phoneNumber) {
    AND.push({
      phone_number: { contains: phoneNumber },
    });
  }

  if (city || street || village) {
    AND.push({
      customer_addresses: {
        some: {
          is_active: true,
          ...(city && { city: { contains: city } }),
          ...(village && { village: { contains: village } }),
          ...(street && { street: { contains: street } }),
        },
      },
    });
  }

  if (AND.length) where.AND = AND;

  const direction: SortDir = sortDir === 'asc' ? 'asc' : 'desc';

  const orderBy =
    sortBy === 'name'
      ? [{ last_name: direction }, { first_name: direction }, { id: direction }]
      : [{ created_at: direction }, { id: direction }];

  return {
    where,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      phone_number: true,
      customer_addresses: {
        take: 1,
        where: { is_active: true, is_default: true },
        select: {
          formatted_address: true,
          village: true,
        },
      },
    },
    orderBy,
  };
}
