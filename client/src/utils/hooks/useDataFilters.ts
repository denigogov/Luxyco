import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { CustomersListParams } from "../../features/customers/customers.types";

type Filters = Pick<
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
    name: readParam(sp, "name") as Filters["name"],
    street: readParam(sp, "street") as Filters["street"],
    city: readParam(sp, "city") as Filters["city"],
    phoneNumber: readParam(sp, "phoneNumber") as Filters["phoneNumber"],
    village: readParam(sp, "village") as Filters["village"],
    sortBy: readParam(sp, "sortBy") as Filters["sortBy"],
    sortDir: readParam(sp, "sortDir") as Filters["sortDir"],
    search: readParam(sp, "search") as Filters["search"],

    // Only do these two lines if Filters["page"/"limit"] are numbers:
    limit: toNumberOrUndefined(readParam(sp, "limit")) as Filters["limit"],
    page: toNumberOrUndefined(readParam(sp, "page")) as Filters["page"],
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
