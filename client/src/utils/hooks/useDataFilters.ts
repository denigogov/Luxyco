import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { CustomersListParams } from "../../features/customers/customers.types";
import type { OrdersListParams } from "../../features/orders/orders.types";

type CustomersFilters = Pick<
  CustomersListParams,
  | "name"
  | "street"
  | "city"
  | "phoneNumber"
  | "limit"
  | "village"
  | "sortBy"
  | "sortDir"
  | "page"
  | "search"
>;

type OrdersFilters = Pick<
  OrdersListParams,
  | "page"
  | "limit"
  | "search"
  | "qrCode"
  | "city"
  | "village"
  | "status"
  | "deliveryType"
  | "scheduledFrom"
  | "scheduledTo"
  | "createdFrom"
  | "createdTo"
  | "sortBy"
  | "sortDir"
>;

type DeliverTypeFilter = {
  active?: string;
};

type UsersFilter = {
  userType?: string;
};

export type Filters = CustomersFilters &
  Omit<OrdersFilters, keyof CustomersFilters> &
  DeliverTypeFilter &
  UsersFilter;

type SetFiltersArg = Partial<Filters> | ((prev: Filters) => Partial<Filters>);

function readParam(sp: URLSearchParams, key: string) {
  const v = sp.get(key);
  return v && v.trim() ? v : undefined;
}

function toNumberOrUndefined(v?: string) {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function readFilters(sp: URLSearchParams): Filters {
  return {
    // customers
    name: readParam(sp, "name"),
    street: readParam(sp, "street"),

    // shared
    phoneNumber: readParam(sp, "phoneNumber"),
    city: readParam(sp, "city"),
    village: readParam(sp, "village"),
    search: readParam(sp, "search"),
    sortBy: readParam(sp, "sortBy") as Filters["sortBy"],
    sortDir: readParam(sp, "sortDir") as Filters["sortDir"],
    limit: toNumberOrUndefined(readParam(sp, "limit")),
    page: toNumberOrUndefined(readParam(sp, "page")),

    // orders
    qrCode: readParam(sp, "qrCode"),
    status: readParam(sp, "status"),
    deliveryType: readParam(sp, "deliveryType"),
    scheduledFrom: readParam(sp, "scheduledFrom"),
    scheduledTo: readParam(sp, "scheduledTo"),
    createdFrom: readParam(sp, "createdFrom"),
    createdTo: readParam(sp, "createdTo"),

    // deliveryType
    active: readParam(sp, "active"),

    //users
    userType: readParam(sp, "userType"),
  };
}

export function useDataFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const current = useMemo(() => readFilters(searchParams), [searchParams]);

  const setFilters = useCallback(
    (arg: SetFiltersArg) => {
      setSearchParams((prevSp) => {
        const next = new URLSearchParams(prevSp);
        const prevFilters = readFilters(prevSp);

        const patch = typeof arg === "function" ? arg(prevFilters) : arg;

        (Object.keys(patch) as (keyof Filters)[]).forEach((key) => {
          const value = patch[key];
          if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
          ) {
            next.delete(String(key));
          } else {
            next.set(String(key), String(value));
          }
        });

        return next;
      });
    },
    [setSearchParams],
  );

  return { ...current, setFilters };
}
