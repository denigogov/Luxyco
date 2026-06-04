import { act } from "react";
import type { DeliveryTypeInterface } from "../../../../../features/deliveryType/deliveryType.types";
import { priceFormatted } from "../../../../../utils/helpers/priceFormater";
import { timeFormat } from "../../../../../utils/helpers/timeFormat";
import type { ActiveTagItem } from "../../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type {
  RowMarker,
  RowTypes,
} from "../../../../../whitelabel/src/molecules/table/m-table.types";
import type { CreateDeliveryListTypesTagsArgs } from "./deliveryPriceConfig.types";

export function getDeliveryTypeRowMarker(
  active?: boolean,
): RowMarker | undefined {
  switch (active) {
    case true: // product active
      return undefined;

    case false: // product deactivated
      return {
        variant: "danger",
        message: "неактивен тип на достава",
        onlySideMarker: false,
      };

    default:
      return undefined;
  }
}

export function mapDeliveryListTypeToRow(o: DeliveryTypeInterface): RowTypes {
  return {
    id: String(o.id),
    createdAt: timeFormat(o.createdAt, { showTime: true }),
    updatedAt: timeFormat(o.updatedAt, { showTime: true }),
    type: o.typeName ?? "-",
    price: priceFormatted(o.price),
    status: o.isActive ? "Активен" : "Неактивен",
    rowMarker: getDeliveryTypeRowMarker(o.isActive),
  };
}

export const CreateDeliveryTypesTags = ({
  setFilters,
  limit,
  page,
  active,
}: CreateDeliveryListTypesTagsArgs): ActiveTagItem[] => {
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

    active
      ? {
          key: "тип достава",
          value: String(active) === "true" ? "" : "неактивни",
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({
              active: "vmro",
            });
          },
        }
      : null,
  ].filter(Boolean) as ActiveTagItem[];
};
