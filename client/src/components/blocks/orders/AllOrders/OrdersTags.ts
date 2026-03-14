import type { ActiveTagItem } from "../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { FilterValues } from "../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";

type SetFilters = (patch: Record<string, unknown>) => void;

type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface CreateOrderTagsArgs {
  setFilters: SetFilters;
  setSearchInput: (v: string) => void;
  setResetLocalSort: React.Dispatch<React.SetStateAction<boolean>>;
  setRange: React.Dispatch<React.SetStateAction<DateRange>>;
  setScheduleRange: React.Dispatch<React.SetStateAction<DateRange>>;

  name?: string;
  city?: string;
  street?: string;
  phoneNumber?: string;
  qrCode?: string;
  status?: string;
  deliveryType?: string;
  village?: string;
  searchInput?: string;

  limit?: number;
  page?: number;
  sortBy?: string;
  sortDir?: string;

  createdTo?: string;
  createdFrom?: string;
  scheduledTo?: string;
  scheduledFrom?: string;
}

export const CreateOrderTags = ({
  setFilters,
  setSearchInput,
  setResetLocalSort,
  setRange,
  setScheduleRange,

  name,
  city,
  street,
  phoneNumber,
  qrCode,
  deliveryType,
  village,
  searchInput,
  status,

  limit,
  page,
  sortBy,
  sortDir,

  createdTo,
  createdFrom,
  scheduledTo,
  scheduledFrom,
}: CreateOrderTagsArgs): ActiveTagItem[] => {
  return [
    createdFrom || createdTo
      ? {
          key: "Период",
          value: [createdFrom, createdTo].filter(Boolean).join(" - "),
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({
              createdFrom: undefined,
              createdTo: undefined,
              page: 1,
            });
            setRange({ start: null, end: null });
          },
        }
      : null,

    scheduledFrom || scheduledTo
      ? {
          key: "Закажано",
          value: [scheduledFrom, scheduledTo].filter(Boolean).join(" - "),
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({
              scheduledFrom: undefined,
              scheduledTo: undefined,
              page: 1,
            });
            setScheduleRange({ start: null, end: null });
          },
        }
      : null,

    name
      ? {
          key: "Име",
          value: name,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ name: undefined });
          },
        }
      : null,

    city
      ? {
          key: "Град",
          value: city,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ city: undefined });
          },
        }
      : null,

    street
      ? {
          key: "Улица",
          value: street,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ street: undefined });
          },
        }
      : null,

    phoneNumber
      ? {
          key: "Тел",
          value: phoneNumber,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ phoneNumber: undefined });
          },
        }
      : null,

    qrCode
      ? {
          key: "QR-код",
          value: qrCode,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ qrCode: undefined });
          },
        }
      : null,

    status
      ? {
          key: "Статус",
          value: status,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ status: undefined });
          },
        }
      : null,

    deliveryType
      ? {
          key: "Тип на Испорака",
          value: deliveryType,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ deliveryType: undefined });
          },
        }
      : null,

    village
      ? {
          key: "Село",
          value: village,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ village: undefined });
          },
        }
      : null,

    searchInput?.trim()
      ? {
          key: "Барај",
          value: searchInput.trim(),
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ search: undefined });
            setSearchInput("");
          },
        }
      : null,

    limit && limit !== 20
      ? {
          key: "Резултати по страница",
          value: limit,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ limit: undefined });
          },
        }
      : null,

    page && page > 1
      ? {
          key: "Страница",
          value: page,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ page: undefined });
          },
        }
      : null,

    sortBy && sortDir
      ? {
          key: "Сортирај",
          value: sortBy || sortDir,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ sortBy: undefined, sortDir: undefined });
            setResetLocalSort((prev) => !prev);
          },
        }
      : null,
  ].filter(Boolean) as ActiveTagItem[];
};

export const setFilterValues = ({
  name,
  city,
  street,
  phoneNumber,
  village,
  qrCode,
  status,
  deliveryType,
}: Partial<FilterValues>): FilterValues => ({
  name: name ?? "",
  city: city ?? "",
  street: street ?? "",
  phoneNumber: phoneNumber ?? "",
  village: village ?? "",
  qrCode: qrCode ?? "",
  status: status ?? "",
  deliveryType: deliveryType ?? "",
});
