import { OrdersQueryDto } from '../dto/get-order.dto';

type SortDir = 'asc' | 'desc';

function ymdRange(from?: string, to?: string) {
  const range: { gte?: Date; lte?: Date } = {};
  if (from) range.gte = new Date(`${from}T00:00:00.000`);
  if (to) range.lte = new Date(`${to}T23:59:59.999`);
  return range;
}

export function buildOrdersFindManyArgs(query: OrdersQueryDto) {
  const {
    search,
    qrCode,
    city,
    village,
    status,
    deliveryType,
    scheduledFrom,
    scheduledTo,
    createdFrom,
    createdTo,
    sortBy,
    sortDir,
    phoneNumber,
    name,
  } = query;

  const where: any = {};
  const AND: any[] = [];

  // Dedicated QR code filter
  if (qrCode?.trim()) {
    AND.push({
      qr_code: { contains: qrCode.trim() },
    });
  }

  // Global search: customer + address (token-based AND)
  if (search?.trim()) {
    const tokens = search
      .trim()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 4);

    for (const token of tokens) {
      AND.push({
        OR: [
          // customer fields
          {
            customers: {
              is: {
                OR: [
                  { first_name: { contains: token } },
                  { last_name: { contains: token } },
                  { phone_number: { contains: token } },
                ],
              },
            },
          },
          // address fields
          {
            customers: {
              is: {
                customer_addresses: {
                  some: {
                    is_active: true,
                    OR: [
                      { city: { contains: token } },
                      { village: { contains: token } },
                      { street: { contains: token } },
                      { formatted_address: { contains: token } },
                    ],
                  },
                },
              },
            },
          },
        ],
      });
    }
  }

  // Phone filter
  if (phoneNumber?.trim()) {
    AND.push({
      customers: {
        is: {
          phone_number: {
            contains: phoneNumber.trim(),
          },
        },
      },
    });
  }

  // customer name & lastName
  if (name?.trim()) {
    const tokens = name
      .trim()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 4);

    if (tokens.length === 1) {
      const t = tokens[0];
      AND.push({
        customers: {
          is: {
            OR: [
              { first_name: { contains: t } },
              { last_name: { contains: t } },
            ],
          },
        },
      });
    } else {
      AND.push({
        customers: {
          is: {
            AND: tokens.map((t) => ({
              OR: [
                { first_name: { contains: t } },
                { last_name: { contains: t } },
              ],
            })),
          },
        },
      });
    }
  }

  // Separate city/village filters
  if (city?.trim() || village?.trim()) {
    AND.push({
      customers: {
        is: {
          customer_addresses: {
            some: {
              is_active: true,
              ...(city?.trim() ? { city: { contains: city.trim() } } : {}),
              ...(village?.trim()
                ? { village: { contains: village.trim() } }
                : {}),
            },
          },
        },
      },
    });
  }

  // Status name filter
  if (status?.trim()) {
    AND.push({
      status: { is: { status_name: { contains: status.trim() } } },
    });
  }

  // Delivery type name filter
  if (deliveryType?.trim()) {
    AND.push({
      delivery_type: { is: { type_name: { contains: deliveryType.trim() } } },
    });
  }

  // Scheduled date range
  if (scheduledFrom || scheduledTo) {
    AND.push({
      scheduled_date: ymdRange(scheduledFrom, scheduledTo),
    });
  }

  // Created date range
  if (createdFrom || createdTo) {
    AND.push({
      created_at: ymdRange(createdFrom, createdTo),
    });
  }

  if (AND.length) where.AND = AND;

  const direction: SortDir = sortDir === 'asc' ? 'asc' : 'desc';

  const orderBy =
    sortBy === 'scheduledDate'
      ? [{ scheduled_date: direction }, { id: 'desc' }]
      : [{ created_at: direction }, { id: 'desc' }];

  return {
    where,
    select: {
      id: true,
      qr_code: true,
      scheduled_date: true,
      created_at: true,
      status: { select: { status_name: true, id: true } },
      delivery_type: { select: { type_name: true } },
      customers: {
        select: {
          first_name: true,
          last_name: true,
          phone_number: true,
        },
      },
      total_pieces: true,
      measured_pieces: true,
    },
    orderBy,
  };
}

export function addMeasurementStats<T extends { data: any[] }>(result: T): T {
  return {
    ...result,
    data: result.data.map((order: any) => {
      const total = Number(order.total_pieces ?? 0);
      const measured = Number(order.measured_pieces ?? 0);

      return {
        ...order,
        measurementStatus: {
          progress: `${measured}/${total}`,
          isComplete: total > 0 && measured === total,
        },
      };
    }),
  };
}
