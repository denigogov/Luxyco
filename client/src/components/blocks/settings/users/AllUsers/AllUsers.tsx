import { useMemo, useState } from "react";
import { useUserList } from "../../../../../features/users/users.queries";
import { useDataFilters } from "../../../../../utils/hooks/useDataFilters";
import ASelect from "../../../../../whitelabel/src/atoms/formComponents/select/A-select";
import TableFooterPagination from "../../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import Table from "../../../../../whitelabel/src/molecules/table/M-table";
import { allUsersData } from "./AllUseres.data";
import { CreateUserTags, mapUserListToRow } from "./allUser.helpers";
import ToggleButton from "../../../../../whitelabel/src/atoms/toggle/ToggleButton";
import ActiveTag from "../../../../../whitelabel/src/molecules/activeTag/ActiveTag";
import Button from "../../../../../whitelabel/src/atoms/button/A-Button";
import { useNavigate } from "react-router";

const AllUsers: React.FC = () => {
  const navigate = useNavigate();
  const [showIsActive, setIsActive] = useState<boolean>(true);
  const { page, limit, active, setFilters, userType } = useDataFilters();

  const params = useMemo(
    () => ({
      page: page ?? 1,
      limit,
      active,
      userType,
    }),
    [page, limit, active, userType],
  );

  const { data, isLoading, isError, isFetching } = useUserList(params);
  const tableListData = data?.data ?? [];
  const rows = useMemo(() => {
    return tableListData.map(mapUserListToRow);
  }, [tableListData]);

  const handleFilterReset = () => {
    setFilters({
      limit: undefined,
      page: undefined,
      active: undefined,
      userType: undefined,
    });
  };

  const filterActiveUsers = () => {
    const next = !showIsActive;
    setIsActive(next);

    setFilters({
      active: next ? undefined : "false",
    });
  };

  const filterAccountyType = (
    e: React.ChangeEvent<HTMLSelectElement, Element>,
  ) => {
    const value = e.target.value;
    if (!value) return;

    const reset = value === "all";

    setFilters({
      userType: reset ? undefined : value,
    });
  };

  const clearAllFilterTags = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    handleFilterReset();
  };

  const tags = CreateUserTags({
    setFilters,
    limit,
    page,
    active,
    userType,
  });

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>error</h1>;

  const navigateToCreateUser = () => {
    navigate("add");
  };

  return (
    <div>
      <div className="uk-flex uk-flex-between">
        <div className="uk-flex uk-padding-small" style={{ gap: "20px" }}>
          <Button
            {...allUsersData.createUserBtn}
            onClick={navigateToCreateUser}
          />
          <ASelect
            {...allUsersData.filterByType}
            onChange={(e) => filterAccountyType(e)}
          />
        </div>
        <ToggleButton
          handleToggleOnClick={filterActiveUsers}
          state={showIsActive}
          toggleText={
            showIsActive ? "активни корисници" : "неактивни корисници"
          }
        />
      </div>
      <ActiveTag
        {...allUsersData.tags}
        items={tags}
        onClearAll={clearAllFilterTags}
        className="b-orders-tags"
      />
      <Table
        {...allUsersData.tableData}
        rows={rows}
        loading={isFetching}
        loadingVariant="bar+skeleton"
        loadingRows={limit ?? 10}
      />
      <TableFooterPagination
        {...allUsersData.pagination}
        meta={(data as any)?.meta}
        onPageChange={(p) => setFilters({ page: p })}
        onLimitChange={(l) => setFilters({ limit: l, page: 1 })}
      />
    </div>
  );
};

export default AllUsers;
