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

  if (search && search.trim().length > 0) {
    const tokens = search
      .trim()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    for (const token of tokens) {
      AND.push({
        OR: [
          { first_name: { startsWith: token } },
          { last_name: { startsWith: token } },
          { phone_number: { startsWith: token } },
          {
            customer_addresses: {
              some: {
                is_active: true,
                OR: [
                  { city: { contains: token } },
                  { street: { contains: token } },
                  { village: { contains: token } },
                  { formatted_address: { contains: token } },
                ],
              },
            },
          },
        ],
      });
    }
  }

  // Name filter
  if (name) {
    AND.push({
      OR: [{ first_name: { search: name } }, { last_name: { search: name } }],
    });
  }

  // Phone filter
  if (phoneNumber) {
    AND.push({
      phone_number: { startsWith: phoneNumber },
    });
  }

  // Address filters (structured)
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

export function buildCustomersFindManyForOrderArgs(
  query: Pick<CustomersQueryDto, 'id' | 'search'>,
  isActive: boolean,
) {
  const { search, id } = query;

  const where: any = { is_active: isActive };
  const AND: any[] = [];

  if (id) {
    AND.push({ id: Number(id) });
  }

  if (search && search.trim().length > 0) {
    const tokens = search
      .trim()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    for (const token of tokens) {
      AND.push({
        OR: [
          { first_name: { search: token } },
          { last_name: { search: token } },
          { phone_number: { startsWith: token } },
          {
            customer_addresses: {
              some: {
                is_active: true,
                OR: [
                  { city: { contains: token } },
                  { street: { contains: token } },
                  { village: { contains: token } },
                  { formatted_address: { contains: token } },
                ],
              },
            },
          },
        ],
      });
    }
  }

  if (AND.length) where.AND = AND;
  return {
    where,
    take: 8,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      phone_number: true,
      customer_notes: {
        where: { is_active: true, related_order_id: null },
        select: {
          note_text: true,
        },
      },
      customer_addresses: {
        where: { is_active: true },
        select: {
          id: true,
          formatted_address: true,
          is_default: true,
          is_verified_by_provider: true,
        },
      },
    },
    orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
  };
}
