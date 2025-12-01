import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedResult } from '../types/pagination.types';

type FindManyArgs = {
  where?: unknown;
  include?: unknown;
  select?: unknown;
  orderBy?: unknown;
  distinct?: unknown;
  skip?: number;
  take?: number;
};

type CountArgs = {
  where?: unknown;
  distinct?: unknown;
};

interface PrismaModel<T> {
  findMany(args: FindManyArgs): Promise<T[]>;
  count(args: CountArgs): Promise<number>;
}

export async function paginate<T>(
  model: PrismaModel<T>,
  baseArgs: FindManyArgs,
  query: PaginationQueryDto,
): Promise<PaginatedResult<T>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const safeLimit = Math.max(1, Math.min(100, limit));
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * safeLimit;

  const [data, total] = await Promise.all([
    model.findMany({ ...baseArgs, skip, take: safeLimit }),
    model.count({
      where: baseArgs.where,
      distinct: (baseArgs as any).distinct,
    }),
  ]);

  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}
