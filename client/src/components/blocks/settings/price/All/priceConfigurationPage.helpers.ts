import type { PriceListTypes } from "../../../../../features/price/price.types";
import { timeFormat } from "../../../../../utils/helpers/timeFormat";
import type { ActiveTagItem } from "../../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type {
  RowMarker,
  RowTypes,
} from "../../../../../whitelabel/src/molecules/table/m-table.types";
import type { CreatePriceListTagsArgs } from "./priceConfigurationPage.types";

export function getOrderRowMarker(active?: boolean): RowMarker | undefined {
  switch (active) {
    case true: // product active
      return undefined;

    case false: // product deactivated
      return {
        variant: "danger",
        message: "неактивен продукт",
        onlySideMarker: false,
      };

    default:
      return undefined;
  }
}

export function mapPriceListToRow(o: PriceListTypes): RowTypes {
  return {
    id: String(o.id),
    createdAt: timeFormat(o.createdAt, { showTime: true }),
    updatedAt: timeFormat(o.updatedAt, { showTime: true }),
    product: o.name ?? "-",
    priceModel: o?.priceModel?.name === "PER_PIECE" ? "По Парче" : "По М2",
    price: o.basePrice != null ? String(o.basePrice) : "-",
    status: o.isActive ? "Активен" : "Неактивен",
    rowMarker: getOrderRowMarker(o.isActive),
  };
}

export const CreateOrderTags = ({
  setFilters,
  limit,
  page,
}: CreatePriceListTagsArgs): ActiveTagItem[] => {
  return [
    limit && limit !== 20
      ? {
          key: "Резултати по страница",
          value: String(limit),
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();

            setFilters({
              limit: undefined,
            });
          },
        }
      : null,

    page && page > 1
      ? {
          key: "Страница",
          value: String(page),
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();

            setFilters({
              page: undefined,
            });
          },
        }
      : null,
  ].filter(Boolean) as ActiveTagItem[];
};
