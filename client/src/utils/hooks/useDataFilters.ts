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

export function useDataFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const current = useMemo<Filters>(() => {
    const read = (key: keyof Filters) => {
      const v = searchParams.get(String(key));
      // treat "" as undefined
      return v && v.trim() ? (v as any) : undefined;
    };

    return {
      name: read("name"),
      street: read("street"),
      city: read("city"),
      phoneNumber: read("phoneNumber"),
      limit: read("limit"),
      village: read("village"),
      sortBy: read("sortBy"),
      sortDir: read("sortDir"),
      page: read("page"),
      search: read("search"),
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (arg: SetFiltersArg) => {
      setSearchParams((prevSp) => {
        const prev = new URLSearchParams(prevSp);

        const patch = typeof arg === "function" ? arg(current) : arg;

        (Object.keys(patch) as (keyof Filters)[]).forEach((key) => {
          const value = patch[key];
          if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
          ) {
            prev.delete(String(key));
          } else {
            prev.set(String(key), String(value));
          }
        });

        return prev;
      });
    },
    [setSearchParams, current],
  );

  return { ...current, setFilters };
}
