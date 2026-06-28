import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { SelectTypes } from "../../../../../whitelabel/src/atoms/formComponents/select/a-select.types";
import type { TableFooterPaginationTypes } from "../../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { ActiveTagItemTypes } from "../../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { TableTypes } from "../../../../../whitelabel/src/molecules/table/m-table.types";

type SetFilters = (patch: Record<string, unknown>) => void;
export interface CreateUserListTagsArgs {
  setFilters: SetFilters;
  limit?: number;
  page?: number;
  userType?: string;
  active?: string | boolean;
}

export interface AllUsersTypes {
  filterByType: SelectTypes;
  tableData: TableTypes;
  pagination: TableFooterPaginationTypes;
  tags: ActiveTagItemTypes;
  createUserBtn: ButtonTypes;
}
